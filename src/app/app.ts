import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Toast } from './shared/components/toast/toast';
import { SearchOverlay } from './features/search-overlay/search-overlay';
import { Seo } from './core/seo/seo';
import { SeoRouteData } from './core/seo/route-seo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, SearchOverlay],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private seo = inject(Seo);

  protected readonly title = signal('barber-frontend');

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.applySeo(event.urlAfterRedirects);
        this.scrollToTop();

        if (typeof window !== 'undefined') {
          window.requestAnimationFrame(() => this.scrollToTop());
        }
      });
  }

  /**
   * Applies the active route's `data.seo`. Pages that load their content asynchronously
   * (brand, product) call `Seo.apply` again once they have real data — this pass gives
   * them a correct fallback rather than leaving the previous page's title in the tab.
   */
  private applySeo(url: string): void {
    let route = this.route;
    while (route.firstChild) route = route.firstChild;

    const data = route.snapshot.data['seo'] as SeoRouteData | undefined;
    if (!data) return;

    // Prefer the URL actually navigated to, so canonical follows :params rather than the
    // static path on the route definition.
    const path = url.split('?')[0].split('#')[0] || data.page.path;

    this.seo.apply({
      title: data.page.title,
      description: data.page.description,
      path,
      noindex: data.noindex,
      jsonLd: data.schema?.(this.seo.siteOrigin),
    });
  }

  private scrollToTop(): void {
    if (typeof window === 'undefined') return;

    window.scroll(0, 0);
  }
}

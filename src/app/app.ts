import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Toast } from './shared/components/toast/toast';
import { SearchOverlay } from './features/search-overlay/search-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, SearchOverlay],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
  
})
export class App {
  private router = inject(Router);

  protected readonly title = signal('barber-frontend');

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToTop();

        if (typeof window !== 'undefined') {
          window.requestAnimationFrame(() => this.scrollToTop());
        }
      });
  }

  private scrollToTop(): void {
    if (typeof window === 'undefined') return;

    window.scroll(0, 0);
  }
}

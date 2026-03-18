import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  startWith,
  switchMap,
  catchError,
} from 'rxjs';

import { Shopify } from '../../core/services/shopify';
import { Search } from '../../core/services/search';

interface SearchProductVm {
  id: string;
  title: string;
  vendor?: string;
  imageUrl: string;
  price: string;
  handle?: string;
}

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './search-overlay.html',
  styleUrl: './search-overlay.css',
})
export class SearchOverlay {
  private shopify = inject(Shopify);
  private router = inject(Router);
  public search = inject(Search)

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  isOpen = false;
  isLoading = false;

  searchControl = new FormControl('', { nonNullable: true });
  results: SearchProductVm[] = [];

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((term) => {
          const value = term.trim();

          if (value.length < 2) {
            this.results = [];
            this.isLoading = false;
            return of(null);
          }

          this.isLoading = true;

          return this.shopify.searchProducts(value, 12).pipe(
            catchError((err) => {
              console.error('Search failed', err);
              this.results = [];
              return of({ products: [] });
            }),
            finalize(() => {
              this.isLoading = false;
            }),
          );
        }),
      )
      .subscribe((res: any) => {
        if (!res) return;

        const products = res?.products ?? [];
        this.results = products.map((p: any) => {
          const imageUrl =
            p?.image?.src ??
            p?.image?.url ??
            p?.images?.[0]?.src ??
            p?.images?.edges?.[0]?.node?.url ??
            'assets/images/product-placeholder.jpg';

          const priceRaw =
            p?.price ?? p?.variants?.[0]?.price ?? p?.variants?.edges?.[0]?.node?.price ?? '';
          const price =
            typeof priceRaw === 'string' && priceRaw
              ? `$${priceRaw}`.replace('$$', '$')
              : String(priceRaw || '');

          return {
            id: String(p.id),
            title: p.title ?? 'Untitled product',
            vendor: p.vendor ?? '',
            imageUrl,
            price,
            handle: p.handle ?? '',
          };
        });
      });
  }

  open(): void {
     this.search.open();
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 0);
  }

  close(): void {
    this.search.close();
    this.results = [];
    this.searchControl.setValue('', { emitEvent: false });
    document.body.style.overflow = '';
  }

  clear(): void {
    this.searchControl.setValue('');
    this.results = [];
    this.searchInput?.nativeElement?.focus();
  }

  goToProduct(productId: string): void {
    this.close();
    this.router.navigate(['/product', productId]);
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('search-overlay-backdrop')) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }
}

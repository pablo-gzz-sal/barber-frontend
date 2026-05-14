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
  forkJoin,
  map,
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

interface SearchCollectionVm {
  id: string;
  title: string;
  handle: string;
  imageUrl: string;
  description?: string;
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
  public search = inject(Search);

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  isLoading = false;

  searchControl = new FormControl('', { nonNullable: true });
  results: SearchProductVm[] = [];
  collectionResults: SearchCollectionVm[] = [];

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
            this.collectionResults = [];
            this.isLoading = false;
            return of(null);
          }

          this.isLoading = true;

          return forkJoin({
            products: this.shopify.searchProducts(value, 12).pipe(
              catchError((err) => {
                console.error('Product search failed', err);
                return of({ products: [] });
              }),
            ),
            collections: this.shopify.getCollections().pipe(
              map((res) =>
      
                (res?.collections ?? []).filter((c: any) => {
                  const term = value.toLowerCase();
                  return c.handle
                    .toLowerCase()
                    .split(/\s+/)
                    .some((word: string) => word.startsWith(term));
                }),
              ),
              catchError(() => of([])),
            ),
          }).pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          );
        }),
      )
      .subscribe((res: any) => {
        if (!res) return;

        // Map products
        const products = res?.products?.products ?? res?.products ?? [];
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

        // Map collections (already filtered, comes back as flat array)
        const collections = res?.collections ?? [];
        
        this.collectionResults = collections.map((c: any) => ({
          id: String(c.id),
          title: c.title ?? 'Untitled collection',
          handle: c.handle ?? '',
          imageUrl: c?.image?.src ?? 'assets/images/collection-placeholder.jpg',
          description: '',
        }));
      });
  }

  open(): void {
    this.search.open();
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 0);
  }

  close(): void {
    this.search.close();
    this.results = [];
    this.collectionResults = [];
    this.searchControl.setValue('', { emitEvent: false });
    document.body.style.overflow = '';
  }

  clear(): void {
    this.searchControl.setValue('');
    this.results = [];
    this.collectionResults = [];
    this.searchInput?.nativeElement?.focus();
  }

  goToProduct(productId: string): void {
    this.close();
    this.router.navigate(['/product', productId]);
  }

  goToCollection(handle: string): void {
    this.close();
    this.router.navigate(['/shop/brand/', handle]);
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('search-overlay-backdrop')) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.search.isOpen()) this.close();
  }

  get totalResults(): number {
    return this.results.length + this.collectionResults.length;
  }
}

import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT } from '../../../core/constants/app-text';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { ProductCard } from '../../../shared/models/Product-Card.model';
import { Shopify } from '../../../core/services/shopify';
import { Router, RouterModule } from '@angular/router';

type SaleCard = ProductCard & {
  salePrice: string;
  originalPrice: string;
};

@Component({
  selector: 'app-actual-sale',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './actual-sale.html',
  styleUrl: './actual-sale.css',
})
export class ActualSale implements OnInit, OnChanges {
  @Input() brand?: string | null;

  private shop = inject(Shopify);

  private router = inject(Router);

  protected readonly text = UI_TEXT;

  content = {
    title: 'Shop sale',
  };

  products$!: Observable<any[]>;

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['brand']) {
      this.loadProducts();
    }
  }

  private loadProducts(): void {
    const brandKey = this.normalizeBrandKey(this.brand);
    const hasBrand = !!brandKey;

    // No brand → pull a larger pool so we have variety to randomize from.
    // With brand → keep it tight, 4 is enough.
    const fetchLimit = hasBrand ? 4 : 40;

    this.products$ = this.shop.getSaleProducts(fetchLimit, 0, brandKey || undefined).pipe(
      map((res: any) => this.asArray(res?.sale)),
      map((products: any[]) => (hasBrand ? products.slice(0, 4) : this.pickRandom(products, 4))),
      map((products: any[]) => products.map((p) => this.toSaleCard(p))),
      catchError((error) => {
        console.error('Failed to load sale products', error);
        return of([]);
      }),
      shareReplay(1),
    );
  }

  /** Fisher–Yates shuffle, then take the first n items. */
  private pickRandom<T>(arr: T[], n: number): T[] {
    if (arr.length <= n) return arr;
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

  private normalizeBrandKey(brand?: string | null): string {
    return String(brand ?? '')
      .trim()
      .toLowerCase();
  }

  private asArray(res: any): any[] {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.products)) return res.products;
    if (Array.isArray(res?.items)) return res.items;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  }

  private toSaleCard(p: any) {
    const variants = Array.isArray(p?.variants)
      ? p.variants
      : Array.isArray(p?.variants?.nodes)
        ? p.variants.nodes
        : Array.isArray(p?.variants?.edges)
          ? p.variants.edges.map((e: any) => e?.node)
          : [];

    const prices = variants
      .map((v: any) => Number(v?.price))
      .filter((n: number) => Number.isFinite(n));

    const compare = variants
      .map((v: any) => Number(v?.compare_at_price))
      .filter((n: number) => Number.isFinite(n) && n > 0);

    const minPrice = prices.length ? Math.min(...prices) : null;
    const minCompare = compare.length ? Math.min(...compare) : null;

    return {
      id: String(p?.id ?? ''),
      name: String(p?.title ?? ''),
      brand: String(p?.vendor ?? ''),
      img: p?.image?.src || p?.images?.[0]?.src || 'assets/images/placeholder-product.png',

      salePrice: minPrice !== null ? `$${minPrice.toFixed(2)}` : '',
      originalPrice:
        minCompare !== null && minPrice !== null && minCompare > minPrice
          ? `$${minCompare.toFixed(2)}`
          : '',
    };
  }
}

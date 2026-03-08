import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT } from '../../../core/constants/app-text';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { ProductCard } from '../../../shared/models/Product-Card.model';
import { Shopify } from '../../../core/services/shopify';
import { RouterModule } from '@angular/router';

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
export class ActualSale implements OnChanges {
  @Input() brand?: string | null;

  private shop = inject(Shopify);

  protected readonly text = UI_TEXT;

  content = {
    title: 'FEATURED PRODUCTS',
  };

  products$!: Observable<any[]>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['brand']) {
      this.loadProducts();
    }
  }

  private loadProducts(): void {
    const brandKey = this.normalizeBrandKey(this.brand);

    this.products$ = this.shop.getSaleProducts(4, 0, brandKey || undefined).pipe(
      map((res: any) => this.asArray(res?.sale)),
      map((products: any[]) => products.slice(0, 4)),
      map((products: any[]) => products.map((p) => this.toSaleCard(p))),
      catchError((error) => {
        console.error('Failed to load sale products', error);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  private normalizeBrandKey(brand?: string | null): string {
    return String(brand ?? '').trim().toLowerCase();
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

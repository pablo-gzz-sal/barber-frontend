import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { UI_TEXT } from '../../../core/constants/app-text';
import { Shopify } from '../../../core/services/shopify';
import { Router, RouterModule } from '@angular/router';

type ProductCard = {
  id: string;
  name: string;
  brand: string;
  price: string;
  img: string;
  handle: string;
};

@Component({
  selector: 'app-shop-best-sellers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-best-sellers.html',
  styleUrl: './shop-best-sellers.css',
})
export class ShopBestSellers implements OnInit, OnChanges {
  @Input() brand?: string | null; 

  products$!: Observable<ProductCard[]>;

    content = {
    title: 'SHOP BESTSELLERS',
    btnAll: 'Shop All',
  };

  constructor(private shopifyService: Shopify, private router: Router) {
    this.products$ = of([]);
  }

 ngOnInit(): void {
  this.products$ = this.buildProductsStream();
}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['brand']) {
      this.products$ = this.buildProductsStream();
    }
  }

  private buildProductsStream(): Observable<ProductCard[]> {
    const brandKey = this.normalizeBrandKey(this.brand);

    if (brandKey) {
      return this.shopifyService.getProductsByTag('hardBestSeller').pipe(
        map((res: any) => this.asArray(res.products)),
        map((arr: any[]) =>
          arr.filter((p) => this.handleBrandMatches(p?.handle, brandKey)),
        ),
        map((arr: any[]) => arr.slice(0, 4)),
        map((arr: any[]) => arr.map((p) => this.toProductCard(p))),
      );
    }
    return this.shopifyService.getBestsellers(4).pipe(
      map((res: any) => this.asArray(res.bestsellers)),
      map((arr: any[]) => arr.slice(0, 4)),
      map((arr: any[]) => arr.map((p) => this.toProductCard(p))),
    );
  }

private normalizeBrandKey(brand?: string | null): string {
  const b = String(brand ?? '').trim().toLowerCase();
  return b.split(' ')[0] || '';
}

  private handleBrandMatches(handle: any, brandKey: string): boolean {
    const h = String(handle ?? '').trim().toLowerCase();
    if (!h) return false;

    const prefix = h.split('-')[0];
    return prefix === brandKey;
  }

private toProductCard(p: any): ProductCard {
  const isGraphQL = !!p?.featuredImage;

  const img = isGraphQL
    ? (p?.featuredImage?.url || 'assets/images/placeholder-product.png')
    : (p?.image?.src || p?.images?.[0]?.src || 'assets/images/placeholder-product.png');

  const prices = isGraphQL
    ? (p?.variants?.edges ?? []).map((e: any) => Number(e?.node?.price))
    : (p?.variants ?? []).map((v: any) => Number(v?.price));

  const validPrices = prices.filter((n: number) => Number.isFinite(n));
  const minPrice = validPrices.length ? Math.min(...validPrices) : null;
  const priceLabel = minPrice !== null ? `$${minPrice.toFixed(2)}` : '';

  return {
    id: String(p?.id ?? ''),
    name: String(p?.title ?? ''),
    brand: String(p?.vendor ?? ''),
    price: priceLabel,
    img,
    handle: String(p?.handle ?? ''),
  };
}

  private asArray(res: any): any[] {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.products)) return res.products;
    if (Array.isArray(res?.bestsellers)) return res.bestsellers;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    return [];
  }

  onShopAll() {
    this.router.navigate(['/shop']);
  }
}

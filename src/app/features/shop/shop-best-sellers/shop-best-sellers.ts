import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { UI_TEXT } from '../../../core/constants/app-text';
import { Shopify } from '../../../core/services/shopify';
import { ProductCard } from '../../../shared/models/Product-Card.model';

@Component({
  selector: 'app-shop-best-sellers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-best-sellers.html',
  styleUrl: './shop-best-sellers.css',
})
export class ShopBestSellers {
  protected readonly text = UI_TEXT;

  content = {
    title: 'SHOP BESTSELLERS',
    btnAll: 'Shop All',
  };

  products$!: Observable<ProductCard[]>;

  constructor(private shopifyService: Shopify) {
    this.products$ = this.shopifyService.getBestsellers(4).pipe(
      map((res: any) => this.asArray(res.bestsellers)),
      map((arr: any[]) => arr.slice(0, 4)),
      map((arr: any[]) => arr.map((p) => this.toProductCard(p))),
    );
  }

  private toProductCard(p: any): ProductCard {
    const img = p?.image?.src || p?.images?.[0]?.src || 'assets/images/placeholder-product.png';

    const prices = (p?.variants ?? [])
      .map((v: any) => Number(v?.price))
      .filter((n: number) => Number.isFinite(n));

    const minPrice = prices.length ? Math.min(...prices) : null;
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
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;

    return [];
  }
}

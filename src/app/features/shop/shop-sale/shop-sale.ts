import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT } from '../../../core/constants/app-text';
import { Observable, map } from 'rxjs';
import { ProductCard } from '../../../shared/models/Product-Card.model';
import { Shopify } from '../../../core/services/shopify';

type SaleCard = ProductCard & {
  salePrice: string;
  originalPrice: string;
};

@Component({
  selector: 'app-shop-sale',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './shop-sale.html',
  styleUrl: './shop-sale.css',
})
export class ShopSale implements OnInit {
  @Input() milbonBanner = true;

  private shop = inject(Shopify);

  protected readonly text = UI_TEXT;

  content = {
    title: 'FEATURED PRODUCTS',
  };

  products$!: Observable<SaleCard[]>;

  ngOnInit(): void {
    // Pick from these collections (change handles to yours)
    const handles = ['davines-more-inside-1', 'olaplex', 'nutrafol-1'];

 this.products$ = this.shop.getRandomFeaturedProducts(handles, 4).pipe(
  map((products) => products.map((p) => this.toSaleCard(p))),
);

  }

  private estimateOriginalPrice(priceLabel: string): string {
    // expects "from $45.00" or "$45.00" or "from $45.00"
    const n = Number(String(priceLabel).replace(/[^\d.]/g, ''));
    if (!Number.isFinite(n) || n <= 0) return '';
    const original = n * 1.25; // +25% “was” price
    return `$${original.toFixed(2)}`;
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
      ...p,
      salePrice: minPrice !== null ? `$${minPrice.toFixed(2)}` : p.price || '',
      originalPrice:
        minCompare !== null && minPrice !== null && minCompare > minPrice
          ? `$${minCompare.toFixed(2)}`
          : '',
    };
  }
}

import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT } from '../../../core/constants/app-text';
import { Observable, map, of, switchMap } from 'rxjs';
import { ProductCard } from '../../../shared/models/Product-Card.model';
import { Shopify } from '../../../core/services/shopify';
import { RouterModule } from '@angular/router';

type SaleCard = ProductCard & {
  salePrice: string;
  originalPrice: string;
  isOnSale: boolean;
};

@Component({
  selector: 'app-shop-sale',
  imports: [CommonModule, RouterModule],
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
    const saleHandle = 'sale';
    const featuredHandles = ['davines-more-inside-1', 'olaplex', 'nutrafol-1'];

    this.products$ = this.shop.getRandomFeaturedProducts([saleHandle], 12).pipe(
      map((products) => products.map((p) => this.toSaleCard(p))),
      map((products) => products.filter((p) => this.isOnSale(p))),
      map((saleProducts) => this.shuffle(saleProducts).slice(0, 4)),
      switchMap((saleProducts) => {
        if (saleProducts.length === 4) {
          this.content.title = 'Shop Sale';
          return of(saleProducts);
        }

        return this.shop.getRandomFeaturedProducts(featuredHandles, 12).pipe(
          map((products) => products.map((p) => this.toSaleCard(p))),
          map((products) => this.shuffle(products).slice(0, 4)),
          map((featuredProducts) => {
            this.content.title = saleProducts.length > 0 ? 'Shop Sale' : 'Featured Products';

            // if there are some sale items, prioritize them and fill remaining slots with featured
            const merged = [...saleProducts];
            console.log(featuredProducts);
            
            for (const product of featuredProducts) {
              if (merged.length >= 4) break;
              if (!merged.some((p) => p.id === product.id)) {
                merged.push(product);
              }
            }

            return merged.slice(0, 4);
          }),
        );
      }),
    );
  }

  private estimateOriginalPrice(priceLabel: string): string {
    // expects "from $45.00" or "$45.00" or "from $45.00"
    const n = Number(String(priceLabel).replace(/[^\d.]/g, ''));
    if (!Number.isFinite(n) || n <= 0) return '';
    const original = n * 1.25; // +25% “was” price
    return `$${original.toFixed(2)}`;
  }
  private toSaleCard(p: any): SaleCard {
    const variants = Array.isArray(p?.variants)
      ? p.variants
      : Array.isArray(p?.variants?.nodes)
        ? p.variants.nodes
        : Array.isArray(p?.variants?.edges)
          ? p.variants.edges.map((e: any) => e?.node)
          : [];

    const prices = variants
      .map((v: any) => Number(v?.price))
      .filter((n: number) => Number.isFinite(n) && n > 0);

    const comparePrices = variants
      .map((v: any) => Number(v?.compare_at_price))
      .filter((n: number) => Number.isFinite(n) && n > 0);

    const minPrice = prices.length ? Math.min(...prices) : null;
    const minCompare = comparePrices.length ? Math.min(...comparePrices) : null;
    const isOnSale = minPrice !== null && minCompare !== null && minCompare > minPrice;

    const fallbackRawPrice = p?.price ?? p?.variants?.[0]?.price ?? null;
    const fallbackPrice =
      fallbackRawPrice !== null && fallbackRawPrice !== undefined && fallbackRawPrice !== ''
        ? `$${Number(fallbackRawPrice).toFixed(2)}`
        : '';

    const finalPrice = minPrice !== null ? `$${minPrice.toFixed(2)}` : fallbackPrice;

    return {
      id: String(p.id),
      handle: p.handle ?? '', // ✅ add this
      name: p.name ?? p.title ?? '',
      brand: p.brand ?? p.vendor ?? '',
      img: p.img ?? p.imageUrl ?? p.image?.src ?? p.images?.[0]?.src ?? '',
      price: finalPrice,
      salePrice: finalPrice,
      originalPrice: isOnSale && minCompare !== null ? `$${minCompare.toFixed(2)}` : '',
      isOnSale,
    };
  }

  onMilbon() {
    const url =
      'https://shop.saloninteractive.com/store/josephbattistillc?utm_source=SalonInteractive&utm_medium=web&utm_campaign=ShareMyStore';
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private isOnSale(product: any): boolean {
    const sale = this.toNumber(product.salePrice);
    const original = this.toNumber(product.originalPrice);
    return original > 0 && sale > 0 && original > sale;
  }

  private toNumber(price: string | number | null | undefined): number {
    if (price == null) return 0;
    const n = Number(String(price).replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }

  private shuffle<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Cart } from '../../core/services/cart';
import { CartItem } from '../../core/services/cart';
import { Shopify, ProductVariantLite } from '../../core/services/shopify';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast-service';

type ShopifyImage = {
  src: string;
  variant_ids: Array<string | number>;
};

// Shopify REST /products/:id returns media[] with these fields
type ShopifyMediaSource = {
  url: string;
  mimeType: string; // ← camelCase, matches your API response
  format: string;
  height: number;
  width: number;
};

type ShopifyMedia = {
  media_type: 'image' | 'video' | 'external_video' | 'model_3d';
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  sources?: ShopifyMediaSource[];
  preview_image?: { src: string };
};

type ShopifyProduct = {
  id: string;
  title: string;
  body_html?: string;
  handle: string;
  image?: { src: string };
  images?: ShopifyImage[];
  media?: ShopifyMedia[];
};

// Unified type used by the template
export type MediaItem = {
  type: 'image' | 'video';
  src: string; // main display src (image url or video url)
  thumb: string; // thumbnail shown in the strip
};

@Component({
  selector: 'app-product-action',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './product-action.html',
  styleUrl: './product-action.css',
})
export class ProductAction {
  private route = inject(ActivatedRoute);
  private cart = inject(Cart);
  private shopify = inject(Shopify);
  private toast = inject(ToastService);

  loading = signal(true);
  error = signal<string | null>(null);

  product = signal<ShopifyProduct | null>(null);
  variants = signal<ProductVariantLite[]>([]);

  qty = signal(1);
  selectedVariantId = signal<string | null>(null);
  activeMediaIndex = signal(0);
  id!: any;
  selectedVariant = computed(() => {
    const id = this.selectedVariantId();
    if (!id) return null;
    return this.variants().find((v) => String(v.id) === String(id)) ?? null;
  });

  displayPrice = computed(() => {
    const v = this.selectedVariant();
    return v?.price ? `$${v.price}` : null;
  });

  // Build a unified MediaItem[] from product.media (preferred) or product.images fallback
  mediaItems = computed<MediaItem[]>(() => {
    const p = this.product();
    if (!p) return [];

    if (p.media?.length) {
      return p.media
        .filter((m) => m.media_type === 'image' || m.media_type === 'video')
        .map((m): MediaItem => {
          if (m.media_type === 'video') {
            const mp4Sources = m.sources?.filter((s) => s.mimeType === 'video/mp4') ?? [];
            // Pick highest resolution available
            const best = mp4Sources.sort((a, b) => b.height - a.height)[0];
            return {
              type: 'video',
              src: best?.url ?? m.src ?? '',
              thumb: m.preview_image?.src ?? '',
            };
          }
          return {
            type: 'image',
            src: m.src ?? '',
            thumb: m.src ?? '',
          };
        })
        .filter((m) => m.src); // drops anything with empty src
    }

    return (p.images ?? []).map(
      (img): MediaItem => ({
        type: 'image',
        src: img.src,
        thumb: img.src,
      }),
    );
  });

  // Active media, respects variant-image matching
  activeMedia = computed<MediaItem | null>(() => {
    const items = this.mediaItems();
    if (!items.length) return null;

    const p = this.product();
    const vid = this.selectedVariantId();

    // If variant has a linked image, snap to it
    if (p && vid) {
      const imgs = p.images ?? [];
      const match = imgs.find((img) => (img.variant_ids ?? []).map(String).includes(String(vid)));
      if (match) {
        const idx = items.findIndex((m) => m.src === match.src);
        if (idx !== -1) return items[idx];
      }
    }

    return items[this.activeMediaIndex()] ?? items[0];
  });

  shopUrl = computed(() => {
    const p = this.product();
    if (!p?.handle) return null;
    return `${environment.shopifyStorefrontUrl}/products/${p.handle}`;
  });

  canBuy = computed(() => !!this.shopUrl());
  canAdd = computed(() => !!this.selectedVariantId());

  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) {
      this.error.set('Missing product id');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.shopify.getProductById(this.id).subscribe({
      next: (p: ShopifyProduct) => {
        this.product.set(p);
        console.log(p);

        this.shopify.getProductVariants(this.id).subscribe({
          next: (res) => {
            this.variants.set(res.variants ?? []);
            this.selectedVariantId.set(res.variants?.[0]?.id ?? null);
            this.loading.set(false);
          },
          error: (e) => {
            this.error.set(e?.message ?? 'Failed to load variants');
            this.loading.set(false);
          },
        });
      },
      error: (e) => {
        this.error.set(e?.message ?? 'Failed to load product');
        this.loading.set(false);
      },
    });
  }

  setActiveMedia(index: number): void {
    this.activeMediaIndex.set(index);
  }

  isActiveMedia(index: number): boolean {
    const items = this.mediaItems();
    const active = this.activeMedia();
    if (!active) return false;
    return items[index]?.src === active.src;
  }

  getTitleBrand(title?: string | null): string {
    if (!title) return '';
    return title.trim().split(/\s+/)[0] ?? '';
  }

  getTitleRest(title?: string | null): string {
    if (!title) return '';
    const parts = title.trim().split(/\s+/);
    return parts.slice(1).join(' ');
  }

  buyWithShop() {
    const url = this.shopUrl();
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  addToCart() {
    const v = this.selectedVariant();
    if (!v) {
      this.toast.error('Please select a variant');
      return;
    }

    try {
      this.cart.add({ variantId: String(v.id), qty: this.qty() });
      this.toast.success('Item added to cart');
    } catch (e: any) {
      this.toast.error('Failed to add to cart', e?.message ?? '');
    }
  }

  inc() {
    this.qty.set(Math.min(99, this.qty() + 1));
  }
  dec() {
    this.qty.set(Math.max(1, this.qty() - 1));
  }

  onVariantChange(value: string) {
    this.selectedVariantId.set(value);
  }
  onBack() {
    window.history.back();
  }
}

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
import { Seo } from '../../core/seo/seo';
import { productSchema, stripHtml, truncate } from '../../core/seo/schema';

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
  variants?: ProductVariantLite[];
  in_stock?: boolean;
  total_inventory?: number | null;
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
  private seo = inject(Seo);

  loading = signal(true);
  error = signal<string | null>(null);

  product = signal<ShopifyProduct | null>(null);
  variants = signal<ProductVariantLite[]>([]);

  qty = signal(1);
  selectedVariantId = signal<string | null>(null);
  activeMediaIndex = signal(0);
  descriptionOpen = signal(false);
  id!: any;
  selectedVariant = computed(() => {
    const id = this.selectedVariantId();
    if (!id) return null;
    return this.variants().find((v) => String(v.id) === String(id)) ?? null;
  });

  displayPrice = computed(() => {
    const v = this.selectedVariant();
    return v?.price ? this.formatPrice(v.price) : null;
  });

  displayCompareAtPrice = computed(() => {
    const v = this.selectedVariant();
    if (!v?.compare_at_price) return null;

    return this.isSelectedVariantOnSale() ? this.formatPrice(v.compare_at_price) : null;
  });

  isSelectedVariantOnSale = computed(() => {
    const v = this.selectedVariant();
    if (!v) return false;

    const price = this.toPriceNumber(v.price);
    const compareAtPrice = this.toPriceNumber(v.compare_at_price);

    return compareAtPrice !== null && price !== null && compareAtPrice > price;
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

    return (p.images ?? []).map((img): MediaItem => ({
      type: 'image',
      src: img.src,
      thumb: img.src,
    }));
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

  /** Is the currently selected variant purchasable? */
  selectedVariantAvailable = computed(() => {
    const v = this.selectedVariant();
    if (!v) return false;
    return v.available !== false;
  });

  /** Does the product have at least one purchasable variant? */
  anyVariantAvailable = computed(() => {
    const vs = this.variants();
    if (!vs.length) return this.product()?.in_stock !== false;
    return vs.some((v) => v.available !== false);
  });

  /** Remaining units for the selected variant, when Shopify tracks it. */
  selectedVariantStock = computed(() => {
    const v = this.selectedVariant();
    const qty = v?.inventory_quantity;
    return typeof qty === 'number' ? qty : null;
  });

  canBuy = computed(() => !!this.shopUrl() && this.selectedVariantAvailable());
  canAdd = computed(() => !!this.selectedVariantId() && this.selectedVariantAvailable());

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
        this.applySeo(p);

        this.shopify.getProductVariants(this.id).subscribe({
          next: (res) => {
            const variants = this.withProductVariantSaleData(res.variants ?? [], p.variants ?? []);

            this.variants.set(variants);
            const firstAvailable = variants.find((v) => v.available !== false);
            this.selectedVariantId.set(firstAvailable?.id ?? variants[0]?.id ?? null);
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

  /**
   * Replaces the generic /product fallback the router set with the real product, once
   * Shopify has answered. Product markup wasn't in Steph's spec, but the data is already
   * loaded here and it is the highest-value schema on a store page.
   */
  private applySeo(p: ShopifyProduct): void {
    const price = p.variants?.[0]?.price ?? null;
    const image = p.image?.src ?? p.images?.[0]?.src;
    const summary = truncate(stripHtml(p.body_html), 155);

    this.seo.apply({
      title: `${p.title} | Joseph Battisti Salon NYC`,
      description:
        summary || `Shop ${p.title} at Joseph Battisti Salon on Manhattan's Upper East Side.`,
      path: `/product/${this.id}`,
      image,
      ogType: 'product',
      jsonLd: productSchema(this.seo.siteOrigin, {
        id: String(this.id),
        title: p.title,
        descriptionHtml: p.body_html,
        image,
        price,
        inStock: p.in_stock,
      }),
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

  toggleDescription(): void {
    this.descriptionOpen.update((open) => !open);
  }

  private getMetafieldValueInsensitive(metafields: any, key: string): string | null {
    if (!Array.isArray(metafields)) return null;
    const target = key.toLowerCase();
    const mf = metafields.find((m: any) => String(m?.key ?? '').toLowerCase() === target);
    const value = mf?.value;
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  /** Same normalization you use for brand keys elsewhere. */
  private normalizeKey(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private titleParts = new Map<string, { brand: string; rest: string }>();

  private splitTitle(p: any): { brand: string; rest: string } {
    const cacheKey = String(p?.id ?? p?.handle ?? p?.title ?? '');
    const cached = this.titleParts.get(cacheKey);
    if (cached) return cached;

    const title = (p?.title ?? '').trim();
    if (!title) return { brand: '', rest: '' };

    const words = title.split(/\s+/);

    // Priority: metafield override -> vendor
    const override = this.getMetafieldValueInsensitive(p?.metafields, 'displayBrand');
    const candidates = [override, p?.vendor].filter(Boolean) as string[];

    let result: { brand: string; rest: string } | null = null;

    for (const candidate of candidates) {
      const target = this.normalizeKey(candidate);
      if (!target) continue;

      // Consume words until the normalized accumulation equals the brand.
      let acc = '';
      for (let i = 0; i < words.length; i++) {
        acc += this.normalizeKey(words[i]);
        if (acc === target) {
          result = {
            brand: words.slice(0, i + 1).join(' '),
            rest: words.slice(i + 1).join(' '),
          };
          break;
        }
        if (!target.startsWith(acc)) break; // diverged, this candidate isn't a prefix
      }
      if (result) break;

      // Brand exists but isn't in the title: show it on the brand line, keep title intact.
      result = { brand: candidate.trim(), rest: title };
      break;
    }

    // No vendor, no override: fall back to old single-word behaviour.
    result ??= { brand: words[0] ?? '', rest: words.slice(1).join(' ') };

    this.titleParts.set(cacheKey, result);
    return result;
  }

  getTitleBrand(p: any): string {
    return this.splitTitle(p).brand;
  }

  getTitleRest(p: any): string {
    return this.splitTitle(p).rest;
  }

  private formatPrice(price: string | number): string {
    const n = this.toPriceNumber(price);
    if (n === null) return `$${String(price).replace(/^\$/, '')}`;

    return `$${n.toFixed(2)}`;
  }

  private toPriceNumber(price: string | number | null | undefined): number | null {
    if (price === null || price === undefined || price === '') return null;

    const n = Number(String(price).replace(/[^\d.]/g, ''));
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  private withProductVariantSaleData(
    variants: ProductVariantLite[],
    productVariants: ProductVariantLite[],
  ): ProductVariantLite[] {
    const productVariantById = new Map(productVariants.map((v) => [String(v.id), v]));
    const sourceVariants = variants.length ? variants : productVariants;

    return sourceVariants.map((variant) => {
      const productVariant = productVariantById.get(String(variant.id));

      return {
        ...productVariant,
        ...variant,
        compare_at_price: variant.compare_at_price ?? productVariant?.compare_at_price ?? null,
        available: variant.available ?? productVariant?.available ?? true,
        inventory_quantity:
          variant.inventory_quantity ?? productVariant?.inventory_quantity ?? null,
      };
    });
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

    if (v.available === false) {
      this.toast.error('This item is out of stock');
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
    const stock = this.selectedVariantStock();
    const ceiling = stock !== null && stock > 0 ? Math.min(99, stock) : 99;
    this.qty.set(Math.min(ceiling, this.qty() + 1));
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

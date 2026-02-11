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

type ShopifyProduct = {
  id: string;
  title: string;
  body_html?: string;
  handle: string;

  image?: { src: string };
  images?: ShopifyImage[];
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

  selectedVariant = computed(() => {
    const id = this.selectedVariantId();
    if (!id) return null;
    return this.variants().find((v) => String(v.id) === String(id)) ?? null;
  });

  // ✅ price based on selected variant
  displayPrice = computed(() => {
    const v = this.selectedVariant();
    return v?.price ? `$${v.price}` : null;
  });

  // ✅ image that matches variant if possible
  selectedImageUrl = computed(() => {
    const p = this.product();
    const vid = this.selectedVariantId();
    if (!p) return null;

    const imgs = p.images ?? [];
    const match = imgs.find((img) => (img.variant_ids ?? []).map(String).includes(String(vid)));

    return match?.src ?? p.image?.src ?? imgs[0]?.src ?? null;
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
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing product id');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // 1) Fetch product
    this.shopify.getProductById(id).subscribe({
      next: (p: ShopifyProduct) => {
        this.product.set(p);

        // 2) Fetch variants list (lite) — new endpoint
        this.shopify.getProductVariants(id).subscribe({
          next: (res) => {
            this.variants.set(res.variants ?? []);
            this.selectedVariantId.set(res.variants?.[0]?.id ?? null); // default to first
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
      this.cart.add({
        variantId: String(v.id),
        qty: this.qty(),
      });

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
}

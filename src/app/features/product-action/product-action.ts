import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../core/services/cart';
import { Shopify } from '../../core/services/shopify';

// Use YOUR real CartService path
import { Cart } from '../../core/services/cart';

type ShopProduct = {
  id: string;
  title: string;
  descriptionHtml?: string;
  price?: string | number;
  imageUrl?: string;
  shopUrl?: string; // product page on Shopify (or your shop route)
};

@Component({
  selector: 'app-product-action',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-action.html',
  styleUrl: './product-action.css',
})
export class ProductAction {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cart = inject(Cart);
  private shopify = inject(Shopify);

  // 🔁 Replace with your backend base URL pattern
  private apiBase = 'http://localhost:3000';

  loading = signal(true);
  error = signal<string | null>(null);
  product = signal<ShopProduct | null>(null);

  qty = signal(1);

  canBuy = computed(() => !!this.product()?.shopUrl);
  canAdd = computed(() => !!this.product()?.id);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing product id');
      this.loading.set(false);
      return;
    }

    // ✅ Product endpoint call (adjust path to your actual endpoint)
    // Example patterns you might have:
    // GET /shopify/products/:id
    // GET /products/:id
    // GET /shopify/product/:handle
    this.shopify.getProductById(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e?.message ?? 'Failed to load product');
        this.loading.set(false);
      },
    });
  }

  buyWithShop() {
    const url = this.product()?.shopUrl;
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  addToCart() {
    const p = this.product();
    if (!p) return;

    // ✅ You MUST have a variantId from your product endpoint
    // If your endpoint currently doesn't return it, you need to add it (most Shopify carts add variants).
    const variantId = (p as any).variantId;

    if (!variantId) {
      console.error('Missing variantId on product', p);
      return;
    }

    const item: CartItem = {
      variantId,
      qty: this.qty(),
      // include any other required CartItem fields here if your type needs them
      title: p.title,
      image: p.imageUrl,
      price: (typeof p.price === 'string' ? parseFloat(p.price) : p.price) || 0,
    };

    this.cart.add(item);
  }

  inc() {
    this.qty.set(Math.min(99, this.qty() + 1));
  }

  dec() {
    this.qty.set(Math.max(1, this.qty() - 1));
  }
}

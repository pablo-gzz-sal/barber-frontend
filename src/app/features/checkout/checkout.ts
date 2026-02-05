import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, Cart } from '../../core/services/cart';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { Shopify } from '../../core/services/shopify';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

type HydratedCartItem = CartItem & {
  title?: string;
  image?: string;
  price?: number;
  variantTitle?: string;
};

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  readonly shopDomain = 'josephbattisti-com.myshopify.com';

  items = signal<CartItem[]>([]);

  subtotal = computed(() => this.items().reduce((s, i) => s + (i.price || 0) * i.qty, 0));
  estimatedTax = computed(() => 0);
  total = computed(() => this.subtotal() + this.estimatedTax());

  loading = signal(false);

  constructor(
    private cart: Cart,
    private shopify: Shopify,
  ) {
    this.items.set(this.cart.getItems());
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadItems();
  }

  private pickVariantImage(product: any, variantId: string): string {
    const vid = String(variantId);

    // Try to find an image explicitly tied to this variant
    const match =
      product?.images?.find((img: any) => (img?.variant_ids ?? []).map(String).includes(vid)) ??
      null;

    return match?.src ?? product?.image?.src ?? product?.images?.[0]?.src ?? '';
  }

  loadItems() {
    const raw = this.cart.getItems();
    if (!raw.length) {
      this.items.set([]);
      return;
    }

    this.loading.set(true);

    const calls = raw.map((ci) =>
      this.shopify.getVariantById(String(ci.variantId)).pipe(
        switchMap((variantRes: any) => {
          const variant = variantRes?.variant ?? variantRes;
          const productId = variant?.product_id;

          if (!productId) {
            const price = Number(variant?.price ?? 0) || 0;
            const variantTitle = variant?.title ?? '';
            return of({
              ...ci,
              title: variantTitle || 'Item',
              variantTitle,
              image: '',
              price,
            } as HydratedCartItem);
          }

          return this.shopify.getProductById(String(productId)).pipe(
            map((product: any) => {
              const price = Number(variant?.price ?? 0) || 0;

              const productTitle = product?.title ?? product?.product?.title ?? '';

              const variantTitle = variant?.title ?? '';

              const image = this.pickVariantImage(
                product?.product ?? product,
                String(ci.variantId),
              );

              return {
                ...ci,
                title: productTitle
                  ? `${productTitle}${variantTitle ? ` — ${variantTitle}` : ''}`
                  : variantTitle || 'Item',
                variantTitle,
                image,
                price,
              } as HydratedCartItem;
            }),
            catchError(() => {
              const price = Number(variant?.price ?? 0) || 0;
              const variantTitle = variant?.title ?? '';
              return of({
                ...ci,
                title: variantTitle || 'Item',
                variantTitle,
                image: '',
                price,
              } as HydratedCartItem);
            }),
          );
        }),
        catchError(() =>
          of({
            ...ci,
            title: 'Item',
            price: 0,
            image: '',
          } as HydratedCartItem),
        ),
      ),
    );

    forkJoin(calls).subscribe({
      next: (hydrated) => {
        this.items.set(hydrated);
        this.loading.set(false);
      },
      error: () => {
        this.items.set(raw as HydratedCartItem[]);
        this.loading.set(false);
      },
    });
  }

  refresh() {
    const raw = this.cart.getItems();
    const current = this.items();

    const merged = raw.map((ci) => {
      const prev = current.find((x) => String(x.variantId) === String(ci.variantId));

      return { ...ci, ...prev } as HydratedCartItem;
    });

    this.items.set(merged);
  }

  dec(item: HydratedCartItem) {
    const nextQty = Math.max(0, item.qty - 1);

    this.cart.updateQty(String(item.variantId), nextQty);

    this.items.update((list) =>
      list
        .map((x) => (String(x.variantId) === String(item.variantId) ? { ...x, qty: nextQty } : x))
        .filter((x) => x.qty > 0),
    );

    this.refresh();
  }

  inc(item: HydratedCartItem) {
    const nextQty = item.qty + 1;

    this.cart.updateQty(String(item.variantId), nextQty);

    this.items.update((list) =>
      list.map((x) =>
        String(x.variantId) === String(item.variantId) ? { ...x, qty: nextQty } : x,
      ),
    );

    this.refresh();
  }

  remove(item: HydratedCartItem) {
    this.cart.remove(String(item.variantId));

    this.items.update((list) => list.filter((x) => String(x.variantId) !== String(item.variantId)));

    this.refresh();
  }

  goPay() {
    this.cart.checkout(this.shopDomain);
  }

  formatMoney(value: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  goCheckout() {
    this.cart.checkout('josephbattisti-com.myshopify.com');
  }
}

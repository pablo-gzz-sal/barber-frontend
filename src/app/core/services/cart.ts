import { computed, Injectable, signal } from '@angular/core';

export type CartItem = {
  variantId: string; // REQUIRED for Shopify cart permalink
  title?: string;
  price?: number; // store as number for totals
  image?: string;
  qty: number;
};

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private key = 'barber_cart_v1';

  // ✅ single source of truth
  private readonly _items = signal<CartItem[]>(this.read());

  // ✅ header badge
  readonly count = computed(() =>
    this._items().reduce((sum, i) => sum + (Number(i.qty) || 0), 0),
  );

  // ✅ cart list consumers
  readonly items = computed(() => this._items());

  // --------------------------
  // Public API
  // --------------------------

  getItems(): CartItem[] {
    // ✅ always return current state (reactive)
    return this._items();
  }

  setItems(items: CartItem[]) {
    this.commit(items);
  }

  add(item: CartItem) {
    const items = [...this._items()];
    const existing = items.find((i) => String(i.variantId) === String(item.variantId));

    if (existing) {
      existing.qty += Number(item.qty) || 0;
      // If you want to update display fields when re-adding:
      existing.title = item.title ?? existing.title;
      existing.image = item.image ?? existing.image;
      existing.price = item.price ?? existing.price;
    } else {
      items.push({
        ...item,
        variantId: String(item.variantId),
        qty: Number(item.qty) || 0,
      });
    }

    // Remove invalid qty
    const cleaned = items.filter((i) => (Number(i.qty) || 0) > 0);

    this.commit(cleaned);
  }

updateQty(variantId: string, qty: number) {
  const nextQty = Number(qty) || 0;
  const items = [...this._items()];

  const idx = items.findIndex((i) => String(i.variantId) === String(variantId));
  if (idx === -1) return;

  if (nextQty <= 0) {
    items.splice(idx, 1);
    this.commit(items);
    return;
  }

  items[idx] = { ...items[idx], qty: nextQty };
  this.commit(items);
}

remove(variantId: string) {
  const items = this._items().filter((i) => String(i.variantId) !== String(variantId));
  this.commit(items);
}


  clear() {
    this.commit([]);
  }

  subtotal(): number {
    return this._items().reduce(
      (sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0),
      0,
    );
  }

  /**
   * Redirect to Shopify hosted cart/checkout.
   * Shopify will show Shop Pay / PayPal / Google Pay if enabled in Shopify admin.
   */
  checkout(shopDomain: string) {
    const items = this._items();
    if (!items.length) return;

    // Shopify format: /cart/VARIANT_ID:QTY,VARIANT_ID:QTY
    const line = items.map((i) => `${i.variantId}:${i.qty}`).join(',');
    window.location.href = `https://${shopDomain}/cart/${line}`;
  }

  // --------------------------
  // Internal helpers
  // --------------------------

  private commit(items: CartItem[]) {
    this._items.set(items);
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  private read(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.key);
      const items = raw ? (JSON.parse(raw) as CartItem[]) : [];

      // Normalize types defensively
      return (items ?? [])
        .map((i) => ({
          ...i,
          variantId: String((i as any).variantId),
          qty: Number((i as any).qty) || 0,
          price: (i as any).price != null ? Number((i as any).price) : undefined,
        }))
        .filter((i) => i.qty > 0);
    } catch {
      return [];
    }
  }
}

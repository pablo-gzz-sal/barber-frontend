import { Injectable } from '@angular/core';

export type CartItem = {
  variantId: number; // REQUIRED for Shopify cart permalink
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

  getItems(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]');
    } catch {
      return [];
    }
  }

  setItems(items: CartItem[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  add(item: CartItem) {
    const items = this.getItems();
    const existing = items.find((i) => i.variantId === item.variantId);
    if (existing) existing.qty += item.qty;
    else items.push(item);
    this.setItems(items);
  }

  updateQty(variantId: number, qty: number) {
    const items = this.getItems()
      .map((i) => (i.variantId === variantId ? { ...i, qty } : i))
      .filter((i) => i.qty > 0);
    this.setItems(items);
  }

  remove(variantId: number) {
    this.setItems(this.getItems().filter((i) => i.variantId !== variantId));
  }

  clear() {
    localStorage.removeItem(this.key);
  }

  subtotal(): number {
    return this.getItems().reduce((sum, i) => sum + (i?.price || 0) * i.qty, 0);
  }

  /**
   * Redirect to Shopify hosted cart/checkout.
   * Shopify will show Shop Pay / PayPal / Google Pay if enabled in Shopify admin.
   */
  checkout(shopDomain: string) {
    const items = this.getItems();
    if (!items.length) return;

    const line = items.map((i) => `${i.variantId}:${i.qty}`).join(',');
    window.location.href = `https://${shopDomain}/cart/${line}`;
  }
}

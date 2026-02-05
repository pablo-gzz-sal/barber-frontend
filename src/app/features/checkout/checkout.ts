import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, Cart } from '../../core/services/cart';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {

  readonly shopDomain = 'josephbattisti-com.myshopify.com';

  items = signal<CartItem[]>([]);

  subtotal = computed(() => this.items().reduce((s, i) => s + (i.price || 0) * i.qty, 0));
  estimatedTax = computed(() => 0);
  total = computed(() => this.subtotal() + this.estimatedTax());

  constructor(private cart: Cart) {
    this.items.set(this.cart.getItems());
  }

  refresh() {
    this.items.set(this.cart.getItems());
  }

  dec(item: CartItem) {
    this.cart.updateQty(item.variantId, Math.max(0, item.qty - 1));
    this.refresh();
  }

  inc(item: CartItem) {
    this.cart.updateQty(item.variantId, item.qty + 1);
    this.refresh();
  }

  remove(item: CartItem) {
    this.cart.remove(item.variantId);
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

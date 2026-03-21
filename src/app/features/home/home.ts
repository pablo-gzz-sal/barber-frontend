import { Component, OnInit, inject } from '@angular/core';
import { Header } from '../../core/components/header/header';
import { Cart } from '../../core/services/cart';
import { Hero } from './hero/hero';
import { ShopBestSellers } from '../shop/shop-best-sellers/shop-best-sellers';
import { HairKinetics } from '../kinetics/hair-kinetics/hair-kinetics';
import { TreatmentsHero } from '../treatments/treatments-hero/treatments-hero';
import { Editorial } from '../editorial/editorial/editorial';
import { ServicesGrid } from '../services/services-grid/services-grid';
import { Reviews } from '../reviews/reviews/reviews';
import { Artist } from '../about/artist/artist';
import { Salon } from '../about/salon/salon';
import { ShopSale } from '../shop/shop-sale/shop-sale';
import { Footer } from '../../core/components/footer/footer';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Header,
    Hero,
    ShopBestSellers,
    HairKinetics,
    TreatmentsHero,
    Editorial,
    ServicesGrid,
    Artist,
    Salon,
    ShopSale,
    Footer,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private cart = inject(Cart);

  ngOnInit(): void {
    this.checkForReturnedCheckout();
  }

  checkForReturnedCheckout() {
    const pending = sessionStorage.getItem('pending_shopify_checkout');
    const at = Number(sessionStorage.getItem('pending_shopify_checkout_at') || 0);

    if (!pending || !at) return;

    const ageMs = Date.now() - at;
    const maxAgeMs = 1000 * 60 * 90;

    if (ageMs <= maxAgeMs) {
      this.cart.clear();
    }

    sessionStorage.removeItem('pending_shopify_checkout');
    sessionStorage.removeItem('pending_shopify_checkout_at');
  }
}

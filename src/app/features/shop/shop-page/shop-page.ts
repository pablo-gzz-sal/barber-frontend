import { Component, OnInit } from '@angular/core';
import { Header } from '../../../core/components/header/header';
import { Footer } from '../../../core/components/footer/footer';
import { ShopBestSellers } from '../shop-best-sellers/shop-best-sellers';
import { ShopBrands } from '../shop-brands/shop-brands';
import { ActualSale } from '../actual-sale/actual-sale';
import { IS_BROWSER } from '../../../core/platform';

@Component({
  selector: 'app-shop-page',
  imports: [Header, Footer, ShopBestSellers, ShopBrands, ActualSale],
  standalone: true,
  templateUrl: './shop-page.html',
  styleUrl: './shop-page.css',
})
export class ShopPage implements OnInit {
  ngOnInit() {
    if (IS_BROWSER) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }
}

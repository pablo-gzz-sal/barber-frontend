import { Component } from '@angular/core';
import { Header } from "../../../core/components/header/header";
import { Footer } from "../../../core/components/footer/footer";
import { ShopBestSellers } from "../shop-best-sellers/shop-best-sellers";
import { ShopBrands } from "../shop-brands/shop-brands";
import { ShopBy } from "../shop-by/shop-by";
import { ShopSale } from "../shop-sale/shop-sale";

@Component({
  selector: 'app-shop-page',
  imports: [Header, Footer, ShopBestSellers, ShopBrands, ShopBy, ShopSale],
  standalone: true,
  templateUrl: './shop-page.html',
  styleUrl: './shop-page.css',
})
export class ShopPage {

}

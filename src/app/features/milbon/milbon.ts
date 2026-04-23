import { Component, OnInit } from '@angular/core';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';

@Component({
  selector: 'app-milbon',
  imports: [Header, Footer],
  templateUrl: './milbon.html',
  styleUrl: './milbon.css',
})
export class Milbon implements OnInit {
  loading = true;

  brandAboutImageUrl = 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/milbonFooter.jpg?v=1776903860https://cdn.shopify.com/s/files/1/0573/6602/0281/files/milbonFooter.jpg?v=1776904402';
  logoUrl = 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/milbonLogo_36c7d424-2c86-4b76-bccc-dd699f8505a0.png?v=1776904029'

  milbonHero = 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/milbonHero.png?v=1776905587'
  whyWeLoveText = ''
  signatureUrl = 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Salon_Logo.png?v=1622039261'

  brandDescription = 'We proudly carry products from Milbon, a globally recognized leader in professional haircare known for its advanced research and precision-based formulations. Developed in Japan, Milbon products are designed to treat hair at a structural level, targeting specific concerns such as dryness, damage, frizz, and loss of elasticity. Our team will recommend the right combination of products based on your hair’s condition, lifestyle, and desired outcome.'
  ngOnInit() {
    this.loading = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { RouterLink } from '@angular/router';
import { IS_BROWSER } from '../../core/platform';

@Component({
  selector: 'app-milbon',
  imports: [Header, Footer, RouterLink],
  templateUrl: './milbon.html',
  styleUrl: './milbon.css',
})
export class Milbon implements OnInit {
  loading = true;

  brandAboutImageUrl =
    'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/milbonFooter.jpg?v=1776903860https://cdn.shopify.com/s/files/1/0573/6602/0281/files/milbonFooter.jpg?v=1776904402';
  logoUrl =
    'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/milbonLogo_36c7d424-2c86-4b76-bccc-dd699f8505a0.png?v=1776904029';

  milbonHero = 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/milbonHero.png?v=1776905587';
  whyWeLoveText =
    'Milbon blends decades of Japanese hair science with luxurious formulations that deliver visible, lasting results. Every collection is thoughtfully designed to address your hair’s unique needs—helping restore strength, shine, and manageability without compromising the hair’s natural beauty.';
  signatureUrl =
    'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Salon_Logo.png?v=1622039261';

  brandDescription =
    'We proudly carry products from Milbon, a globally recognized leader in professional haircare known for its advanced research and precision-based formulations. Developed in Japan, Milbon products are designed to treat hair at a structural level, targeting specific concerns such as dryness, damage, frizz, and loss of elasticity. Our team will recommend the right combination of products based on your hair’s condition, lifestyle, and desired outcome.';

  signatureMilbon =
    'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/signtaureMilbon.jpg?v=1777065847';
  proMilbon = 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/proMilbon.jpg?v=1777065847 ';
  monochromaticMilbon =
    'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/monochromaticMilbon.jpg?v=1777065848';
  goldMilbon = 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/goldMilbon.jpg?v=1777065847';
  giftsMilbon =
    'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/giftsMilbon.jpg?v=1777065847';

  ngOnInit() {
    this.loading = false;
    if (IS_BROWSER) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  onMilbon() {
    const url =
      'https://shop.saloninteractive.com/store/josephbattistillc?utm_source=SalonInteractive&utm_medium=web&utm_campaign=ShareMyStore';
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

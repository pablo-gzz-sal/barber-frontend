import { Component, OnInit } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IS_BROWSER } from '../../../core/platform';

@Component({
  selector: 'app-salon',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './salon.html',
  styleUrl: './salon.css',
})
export class Salon implements OnInit {
  protected readonly text = UI_TEXT;

  content = {
    quote: "Battisti's chair is a haven for escapees from too-trendy stylists.",
    title: 'From Manhattan to Los Angeles',
    description:
      'Come visit us at our New York City salon, or catch Joseph regularly in Rochester, NY or Los Angeles, CA.',
    btnText: 'Learn More',
    images: [
      'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/salonHero.jpg?v=1773360111g',
      'assets/images/salon-interior-2.jpg',
      'assets/images/salon-products.jpg',
    ],
  };

  ngOnInit() {
    if (IS_BROWSER) window.scrollTo(0, 0);
  }
}

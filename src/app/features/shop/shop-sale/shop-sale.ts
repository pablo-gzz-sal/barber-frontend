import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';
import { UiButton } from '../../../shared/components/ui-button/ui-button';

@Component({
  selector: 'app-shop-sale',
  imports: [CommonModule, UiButton],
  standalone: true,
  templateUrl: './shop-sale.html',
  styleUrl: './shop-sale.css',
})
export class ShopSale {

  protected readonly text = UI_TEXT;
  content = {
    title: 'SHOP SALE',
    products: [
      {
        brand: 'LANZA',
        name: 'Wellness CBD Soothing Serum',
        salePrice: 'From $40.00',
        originalPrice: 'From $50.00',
        img: 'assets/products/lanza-serum.jpg'
      },
      {
        brand: 'LANZA',
        name: 'Wellness CBD Replenishing Hair Masque',
        salePrice: '$60.00',
        originalPrice: '$75.00',
        img: 'assets/products/lanza-masque.jpg'
      },
      {
        brand: 'LANZA',
        name: 'Wellness CBD Revive Conditioner',
        salePrice: 'From $48.00',
        originalPrice: 'From $60.00',
        img: 'assets/products/lanza-conditioner.jpg'
      },
      {
        brand: 'LANZA',
        name: 'Wellness CBD Soothing Body Crème',
        salePrice: '$48.00',
        originalPrice: '$60.00',
        img: 'assets/products/lanza-creme.jpg'
      }
    ]
  };

}

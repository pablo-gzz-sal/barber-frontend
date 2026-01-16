import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { UiButton } from '../../../shared/components/ui-button/ui-button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-best-sellers',
  imports: [CommonModule, UiButton],
  standalone: true,
  templateUrl: './shop-best-sellers.html',
  styleUrl: './shop-best-sellers.css',
})
export class ShopBestSellers {
  protected readonly text = UI_TEXT;
  content = {
    title: 'SHOP BESTSELLERS',
    btnAll: 'Shop All',
    products: [
      {
        brand: 'DAVINES',
        name: 'Finest Pigments Finest Gloss',
        price: 'from $60.00',
        img: 'assets/products/davines.jpg'
      },
      {
        brand: "L'ANZA",
        name: 'Keratin Healing Oil Hair Treatment',
        price: 'from $95.00',
        img: 'assets/products/lanza.jpg'
      },
      {
        brand: 'AZ',
        name: 'Amplify Texture Spray',
        price: 'from $51.00',
        img: 'assets/products/az.jpg'
      },
      {
        brand: 'HIGHLAND',
        name: 'Glacial Cream',
        price: 'from $29.00',
        img: 'assets/products/highland.jpg'
      }
    ]
  };

}

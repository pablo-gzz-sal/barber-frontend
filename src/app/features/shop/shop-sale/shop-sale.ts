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
}

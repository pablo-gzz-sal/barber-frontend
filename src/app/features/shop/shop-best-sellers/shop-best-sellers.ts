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

}

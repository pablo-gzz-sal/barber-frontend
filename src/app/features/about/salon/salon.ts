import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salon',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './salon.html',
  styleUrl: './salon.css',
})
export class Salon {
  protected readonly text = UI_TEXT;
  content = {
    quote: "Battisti's chair is a haven for escapees from too-trendy stylists.",
    title: 'From Manhattan to Los Angeles',
    description: 'Come visit us at our New York City salon, or catch Joseph regularly in Rochester, NY or Los Angeles, CA.',
    btnText: 'Learn More',
    images: [
      'assets/images/salonHero.jpg',
      'assets/images/salon-interior-2.jpg',
      'assets/images/salon-products.jpg'
    ]
  };

}

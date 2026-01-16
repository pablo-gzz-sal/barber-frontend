import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services-grid',
  imports: [CommonModule],
  templateUrl: './services-grid.html',
  styleUrl: './services-grid.css',
})
export class ServicesGrid {
  protected readonly text = UI_TEXT;
   content = {
    services: {
      title: 'Our Services',
      subtitle: 'What We Do',
      btnBook: 'Book Appointment',
      btnAll: 'See All Services',
      cards: [
        { title: 'Hair Extensions', img: 'assets/services/extensions.jpg' },
        { title: 'Treatments', img: 'assets/services/treatments.jpg' },
        { title: 'Color', img: 'assets/services/color.jpg' },
        { title: 'Styling', img: 'assets/services/styling.jpg' }
      ]
    },
    brands: {
      title: 'SHOP BRANDS WE LOVE',
      btnAll: 'See All Brands',
      logos: [
        { name: 'Davines', img: 'assets/brands/davines-logo.png' },
        { name: 'AZ', img: 'assets/brands/az-logo.png' },
        { name: 'Nutrafol', img: 'assets/brands/nutrafol-logo.png' },
        { name: "L'ANZA", img: 'assets/brands/lanza-logo.png' }
      ]
    }
  };

}

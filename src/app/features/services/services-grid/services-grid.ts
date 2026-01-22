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
        { title: 'Hair Extensions', img: 'assets/images/servicesHairHero.jpg' },
        { title: 'Treatments', img: 'assets/images/hairKinetics.png' },
        { title: 'Color', img: 'assets/images/servicesHairHero.jpg' },
        { title: 'Styling', img: 'assets/images/stylingService.png' }
      ]
    },
    brands: {
      title: 'SHOP BRANDS WE LOVE',
      btnAll: 'See All Brands',
      logos: [
        { name: 'Davines', img: 'assets/svg/davines.svg' },
        { name: 'AZ', img: 'assets/svg/craftLuxury.svg' },
        { name: 'Nutrafol', img: 'assets/svg/nutrafol.svg' },
        { name: "L'ANZA", img: 'assets/svg/lanza.svg' }
      ]
    }
  };

}

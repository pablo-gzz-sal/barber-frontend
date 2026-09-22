import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services-grid',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
        {
          title: 'Hair Extensions',
          img: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Extensions.png?v=1790107029&width=1200',
          bookingUrl: 'https://booking.mangomint.com/307273?showOnlyScId=6',
        },
        {
          title: 'Treatments',
          img: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Treatment.png?v=1790107028&width=1200',
          bookingUrl: 'https://booking.mangomint.com/307273?showOnlyScId=9',
        },
        {
          title: 'Color',
          img: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Color.png?v=1790107027&width=1200',
          bookingUrl: 'https://booking.mangomint.com/307273?showOnlyScId=5',
        },
        {
          title: 'Styling',
          img: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Styling.png?v=1790107028&width=1200',
          bookingUrl: 'https://booking.mangomint.com/307273?showOnlyScId=11',
        },
      ],
    },
    brands: {
      title: 'SHOP BRANDS WE LOVE',
      btnAll: 'See All Brands',
      logos: [
        { name: 'Davines', img: 'assets/svg/davines.svg', dark: false, link: 'davines' },
        { name: 'AZ', img: 'assets/svg/craftLuxuryHaircare.svg', dark: true, link: 'buy-az' },
        { name: 'Nutrafol', img: 'assets/svg/nutrafol.svg', dark: false, link: 'nutrafol-1' },
        { name: "L'ANZA", img: 'assets/svg/lanza.svg', dark: false, link: 'lanza' },
      ],
    },
  };

  openBooking(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

import { Component } from '@angular/core';
import { UI_TEXT } from '../../../core/constants/app-text';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services-grid',
  standalone: true,
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
        {
          title: 'Hair Extensions',
          img: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/hairExtension.jpg?v=1773881386',
          bookingUrl: 'https://booking.mangomint.com/307273?showOnlyScId=6',
        },
        {
          title: 'Treatments',
          img: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/hairKinetics.png?v=1773360123',
          bookingUrl: 'https://booking.mangomint.com/307273?showOnlyScId=9',
        },
        {
          title: 'Color',
          img: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/servicesHairHero.jpg?v=1773360116',
          bookingUrl: 'https://booking.mangomint.com/307273?showOnlyScId=5',
        },
        {
          title: 'Styling',
          img: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/stylingService.png?v=1773360105',
          bookingUrl: 'https://booking.mangomint.com/307273?showOnlyScId=11',
        },
      ],
    },
    brands: {
      title: 'SHOP BRANDS WE LOVE',
      btnAll: 'See All Brands',
      logos: [
        { name: 'Davines', img: 'assets/svg/davines.svg', dark: false, link: 'davines' },
        { name: 'AZ', img: 'assets/svg/craftLuxuryHaircare.svg', dark: true, link: 'craftLuxuryHaircare' },
        { name: 'Nutrafol', img: 'assets/svg/nutrafol.svg', dark: false, link: 'nutrafol' },
        { name: "L'ANZA", img: 'assets/svg/lanza.svg', dark: false, link: 'lanza' },
      ],
    },
  };

  constructor(private router: Router) {}

  onBrand(link: string) {
    console.log(`/shop/brand/${link}`);
    
    this.router.navigate([`/shop/brand/${link}`]);
  }

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

  onAllServices() {
    this.router.navigate(['/services']);
  }

  onBrands() {
    this.router.navigate(['/shop']);
  }
}

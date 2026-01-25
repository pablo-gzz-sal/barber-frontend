import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';

@Component({
  selector: 'app-services-page',
  imports: [CommonModule, Header, Footer],
  standalone: true,
  templateUrl: './services-page.html',
  styleUrl: './services-page.css',
})
export class ServicesPage {
  content = {
    title: 'Our Services',
    extensions: {
      title: 'Extensions',
      services: [
        {
          name: "Sew-In's Extension Consultation",
          price: '$50.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=109',
        },
      ],
    },
    chemicalTreatments: {
      title: 'Chemical Treatments',
      services: [
        {
          name: 'Botanical Smoother',
          price: '$600.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=45',
        },
        {
          name: 'Keratin Treatment',
          price: '$450.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=48',
        },
      ],
    },
    color: {
      title: 'Color',
      services: [
        {
          name: 'Single Process',
          price: '$75.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=25',
        },
        {
          name: 'Double Process',
          price: '$125.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=26',
        },
        {
          name: 'Single Process with Full Highlights',
          price: '$200.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=28',
        },
        {
          name: 'Single Process with Partial Highlights',
          price: '$125.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=29',
        },
        {
          name: 'Eyebrow Color',
          price: '$50.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=97',
        },
        {
          name: '1/4 Highlight',
          price: '$75.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=17',
        },
        {
          name: '1/4 Balayage',
          price: '$75.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=18',
        },
        {
          name: '1/2 Balayage',
          price: '$100.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=20',
        },
        {
          name: '1/2 Highlight',
          price: '$100.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=19',
        },
        {
          name: 'Full Highlight',
          price: '$150.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=21',
        },
        {
          name: 'Full Balayage',
          price: '$125.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=22',
        },
        {
          name: 'Gloss',
          price: '$50.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=24',
        },
      ],
    },
    styling: {
      title: 'Styling',
      services: [
        {
          name: 'Blowout',
          price: '$65.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=59',
        },
        {
          name: 'Braids/Braiding',
          price: '$50.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=108',
        },
        {
          name: 'Silk Press',
          price: '$120.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=110',
        },
        {
          name: 'Style',
          price: '$75.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=63',
        },
        {
          name: 'Updo',
          price: '$150.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=65',
        },
        {
          name: 'Blowout with Clip-ins',
          price: '$175.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=111',
        },
        {
          name: 'Partial Updo',
          price: '$175.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=113',
        },
      ],
    },
    haircuts: {
      title: 'Haircuts',
      services: [
        {
          name: "Women's Haircut",
          price: '$175.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=43',
        },
        {
          name: "Men's Haircut",
          price: '$100.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=41',
        },
        {
          name: "Children's Haircut (under 12 years old)",
          price: '$85.00',
          bookingUrl: 'https://booking.mangomint.com/josephbattistisalon?serviceId=42',
        },
      ],
    },
    cta: {
      title: 'LET US TAKE CARE OF YOU',
      description:
        'Experience luxury hair care with our expert stylists. Book your appointment today and discover the perfect look for you.',
      buttonText: 'Book Appointment',
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

  onBook() {
    if (typeof window === 'undefined') return;

    const a = document.createElement('a');
    a.href = 'https://booking.mangomint.com/307273';

    // optional: avoid navigation if their script fails to load
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    a.remove();
  }

}

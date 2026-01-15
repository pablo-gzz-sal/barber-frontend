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
      services: [{ name: "Save-In's Extension Consultation", price: '$0' }],
    },
    chemicalTreatments: {
      title: 'Chemical Treatments',
      services: [
        { name: 'Botanical Smoother', price: '$475.00' },
        { name: 'Keratin Treatment', price: '$325.00' },
      ],
    },
    color: {
      title: 'Color',
      services: [
        { name: 'Single Process', price: '$95.00+' },
        { name: 'Double Process', price: '$150.00+' },
        { name: 'Single Process with Full Highlights', price: '$300.00+' },
        { name: 'Single Process with Partial Highlights', price: '$250.00+' },
        { name: 'Eyebrow Color', price: '$25.00' },
        { name: '1/4 Highlight', price: '$85.00+' },
        { name: '1/4 Balayage', price: '$125.00+' },
        { name: '1/2 Balayage', price: '$200.00+' },
        { name: '1/2 Highlight', price: '$200.00+' },
        { name: 'Full Highlight', price: '$350.00+' },
        { name: 'Full Balayage', price: '$350.00+' },
        { name: 'Gloss', price: '$75.00+' },
      ],
    },
    styling: {
      title: 'Styling',
      services: [
        { name: 'Blowout', price: '$75.00+' },
        { name: 'Braids/Braiding', price: '$50.00+' },
        { name: 'Silk Press', price: '$120.00+' },
        { name: 'Style', price: '$125.00+' },
        { name: 'Updo', price: '$250.00+' },
        { name: 'Blowout with Clip-ins', price: '$95.00+' },
        { name: 'Partial Updo', price: '$175.00+' },
      ],
    },
    haircuts: {
      title: 'Haircuts',
      services: [
        { name: "Women's Haircut", price: '$85.00' },
        { name: "Men's Haircut", price: '$85.00' },
        { name: "Children's Haircut (under 12 years old)", price: '$85.00' },
      ],
    },
    cta: {
      title: 'LET US TAKE CARE OF YOU',
      description:
        'Experience luxury hair care with our expert stylists. Book your appointment today and discover the perfect look for you.',
      buttonText: 'Book Appointment',
    },
  };
}

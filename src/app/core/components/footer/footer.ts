import { Component } from '@angular/core';
import { UI_TEXT } from '../../constants/app-text';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly text = UI_TEXT;
  content = {
    brand: {
      title: 'JOSEPH BATTISTI',
      description: 'Hair in motion. Beauty in balance.'
    },
    newsletter: {
      title: 'SUBSCRIBE',
      description: 'Join our list for early access to collections and appointments.',
      placeholder: 'Enter your email'
    },
    customerService: {
      title: 'CUSTOMER SERVICE',
      links: ['Contact Us', 'Locations']
    },
    company: {
      title: 'COMPANY',
      links: ['About']
    },
    copyright: '© 2025 JOSEPH BATTISTI studio.'
  };
}

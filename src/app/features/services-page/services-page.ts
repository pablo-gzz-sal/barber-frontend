import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { SERVICES_CONTENT } from './services.data';
import { IS_BROWSER } from '../../core/platform';

@Component({
  selector: 'app-services-page',
  imports: [CommonModule, Header, Footer],
  standalone: true,
  templateUrl: './services-page.html',
  styleUrl: './services-page.css',
})
export class ServicesPage implements OnInit {
  protected readonly content = SERVICES_CONTENT;

  ngOnInit() {
    if (IS_BROWSER) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
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

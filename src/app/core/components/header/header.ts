import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT } from '../../constants/app-text';
import { UiButton } from '../../../shared/components/ui-button/ui-button';
import { environment } from '../../../../environments/environment';
import { CustomerService } from '../../services/customer-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly text = UI_TEXT;
  private router = inject(Router);
  private customer = inject(CustomerService);

  isMenuOpen = false;

  // NEW: desktop dropdown state
  isDesktopDropdownOpen = false;
  activePreviewIndex = 0;

    content = {
      header: {
        hours: 'Time: 9am to 9pm',
        openStatus: 'Open Now',
        btnBook: 'Book Appointment',
      },
    };

  // NEW: menu items with preview images
  menuItems = [
    { label: 'HOME', route: '/', preview: 'assets/images/josephHero.png' },
    { label: 'SHOP', route: '/shop', preview: 'assets/images/candleHero.png' },
    { label: 'MILBON', route: '/milbon', preview: 'assets/images/josephHero.png' },
    { label: 'SERVICES', route: '/services', preview: 'assets/images/josephHero.png' },
    { label: 'ABOUT US', route: '/about', preview: 'assets/images/josephHero.png' },
    { label: 'CONTACT', route: '/contact', preview: 'assets/images/josephHero.png' },
  ];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // NEW: desktop dropdown controls
  openDesktopDropdown() {
    this.isDesktopDropdownOpen = true;
  }
  closeDesktopDropdown() {
    this.isDesktopDropdownOpen = false;
  }
  toggleDesktopDropdown() {
    this.isDesktopDropdownOpen = !this.isDesktopDropdownOpen;
  }

  setPreview(i: number) {
    this.activePreviewIndex = i;
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
    this.isMenuOpen = false;
    this.isDesktopDropdownOpen = false;
  }

  loginWithShopify() {
    window.location.href = `${environment.apiUrl}/customer-auth/login`;
  }

  onAccountClick() {
    this.router.navigateByUrl('/account');
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

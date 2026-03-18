import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT } from '../../constants/app-text';
import { CustomerService } from '../../services/customer-service';
import { NavigationEnd, Router } from '@angular/router';
import { Cart } from '../../services/cart';
import { SearchOverlay } from '../../../features/search-overlay/search-overlay';
import { Search } from '../../services/search';
import { filter } from 'rxjs';

type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

interface DayHours {
  open: string | null; // "09:00"
  close: string | null; // "21:00"
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchOverlay],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  protected readonly text = UI_TEXT;
  private router = inject(Router);
  private customer = inject(CustomerService);
  private cart = inject(Cart);
  public search = inject(Search);

  isMenuOpen = false;
  isOpen = false;
  cartCount = this.cart.count;
  isClosing = false;

  currentRoute = '';

  // NEW: desktop dropdown state
  isDesktopDropdownOpen = false;
  activePreviewIndex = 0;

  content = {
    header: {
      hours: '',
      openStatus: '',
      btnBook: 'Book Appointment',
    },
  };

  private businessHours: Record<DayKey, DayHours> = {
    sunday: { open: null, close: null },
    monday: { open: null, close: null },
    tuesday: { open: '10:00', close: '16:00' },
    wednesday: { open: '09:00', close: '21:00' },
    thursday: { open: '09:00', close: '21:00' },
    friday: { open: '09:00', close: '19:00' },
    saturday: { open: '09:00', close: '17:00' },
  };

  // NEW: menu items with preview images
  menuItems = [
    {
      label: 'HOME',
      route: '/',
      preview:
        'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/josephHeroCut.png?v=1773792821',
    },
    {
      label: 'SHOP',
      route: '/shop',
      preview:
        'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/josephHeroCut.png?v=1773792821',
    },
    {
      label: 'MILBON',
      route: '/milton',
      preview:
        'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/josephHeroCut.png?v=1773792821',
    },
    {
      label: 'SERVICES',
      route: '/services',
      preview:
        'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/josephHeroCut.png?v=1773792821',
    },
    {
      label: 'ABOUT US',
      route: '/about',
      preview:
        'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/josephHeroCut.png?v=1773792821',
    },
    {
      label: 'CONTACT',
      route: '/contact',
      preview:
        'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/josephHeroCut.png?v=1773792821',
    },
  ];

  ngOnInit() {
    this.updateHeaderHours();
    setInterval(() => this.updateHeaderHours(), 60_000);

    this.currentRoute = this.router.url;
    this.syncPreviewWithRoute(this.currentRoute);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute = event.urlAfterRedirects;
        this.syncPreviewWithRoute(this.currentRoute);
      });
  }

  private updateHeaderHours(): void {
    const nowNY = this.getDateInTimeZone('America/New_York');
    const dayKey = this.getDayKey(nowNY);
    const todayHours = this.businessHours[dayKey];

    if (!todayHours.open || !todayHours.close) {
      this.content.header.hours = 'Time: Closed today';
      this.content.header.openStatus = 'Closed';
      return;
    }

    this.content.header.hours = `Time: ${this.formatTime(todayHours.open)} to ${this.formatTime(todayHours.close)}`;
    this.content.header.openStatus = this.isOpenNow(nowNY, todayHours.open, todayHours.close)
      ? 'Open Now'
      : 'Closed';
  }

  private getDayKey(date: Date): DayKey {
    const days: DayKey[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return days[date.getDay()];
  }

  private getDateInTimeZone(timeZone: string): Date {
    const now = new Date();

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(now);

    const map: Record<string, string> = {};
    for (const part of parts) {
      if (part.type !== 'literal') {
        map[part.type] = part.value;
      }
    }

    return new Date(
      Number(map['year']),
      Number(map['month']) - 1,
      Number(map['day']),
      Number(map['hour']),
      Number(map['minute']),
      Number(map['second']),
    );
  }

  private isOpenNow(now: Date, open: string, close: string): boolean {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = this.toMinutes(open);
    const closeMinutes = this.toMinutes(close);

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }

  private toMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const suffix = hours >= 12 ? 'pm' : 'am';
    const hour12 = hours % 12 || 12;

    return minutes === 0
      ? `${hour12}${suffix}`
      : `${hour12}:${String(minutes).padStart(2, '0')}${suffix}`;
  }

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
    if (this.isDesktopDropdownOpen) {
      this.closeMenu();
    } else {
      this.isDesktopDropdownOpen = true;
      this.isOpen = true;
    }
  }

  closeMenu() {
    this.isClosing = true;

    setTimeout(() => {
      this.isDesktopDropdownOpen = false;
      this.isClosing = false;
    }, 600);
  }

  setPreview(i: number) {
    this.activePreviewIndex = i;
  }

  navigateTo(route: string) {
    if (route === '/milton') {
      const url =
        'https://shop.saloninteractive.com/store/josephbattistillc?utm_source=SalonInteractive&utm_medium=web&utm_campaign=ShareMyStore';
      window.open(url, '_blank', 'noopener,noreferrer');
      this.isMenuOpen = false;
      this.isDesktopDropdownOpen = false;
      return;
    }

    this.router.navigateByUrl(route);
    this.isMenuOpen = false;
    this.isDesktopDropdownOpen = false;
  }

  loginWithShopify() {
    window.location.href = `https://shopify.com/57366020281/account`;
  }

  onAccountClick() {
    this.router.navigateByUrl('/account');
  }

  onCart() {
    this.router.navigateByUrl('/checkout');
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

  private syncPreviewWithRoute(url: string): void {
    const index = this.menuItems.findIndex((item) => this.isRouteActive(item.route, url));
    this.activePreviewIndex = index >= 0 ? index : 0;
  }

  isRouteActive(route: string, url: string = this.currentRoute): boolean {
    if (route === '/') {
      return url === '/';
    }

    return url === route || url.startsWith(route + '/');
  }
}

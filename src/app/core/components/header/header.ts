import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT } from '../../constants/app-text';
import { CustomerService } from '../../services/customer-service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Cart } from '../../services/cart';
import { SearchOverlay } from '../../../features/search-overlay/search-overlay';
import { Search } from '../../services/search';
import { filter } from 'rxjs';
import { IS_BROWSER } from '../../platform';

type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

interface DayHours {
  open: string | null; // "09:00"
  close: string | null; // "21:00"
}

interface MenuItem {
  label: string;
  route: string;
  /** Set when the item leaves the app entirely (rendered as a target=_blank anchor). */
  externalUrl?: string;
  preview: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchOverlay, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  protected readonly text = UI_TEXT;
  private router = inject(Router);
  private customer = inject(CustomerService);
  private cart = inject(Cart);
  public search = inject(Search);

  isMenuOpen = false;
  isOpen = false;
  private scrollLocked = false;
  private lockedScrollY = 0;
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
  menuItems: MenuItem[] = [
    {
      label: 'HOME',
      route: '/',
      preview: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/MenuImage.png?v=1774592103',
    },
    {
      label: 'SHOP',
      route: '/shop',
      preview: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/MenuImage.png?v=1774592103',
    },
    {
      label: 'MILBON',
      route: '/milton',
      // Opens the SalonInteractive storefront, not the in-app /milbon page. Preserved as-is
      // — '/milton' was a sentinel navigateTo() intercepted; naming the URL here lets the
      // template render a real external anchor instead of a JS-only button.
      externalUrl:
        'https://shop.saloninteractive.com/store/josephbattistillc?utm_source=SalonInteractive&utm_medium=web&utm_campaign=ShareMyStore',
      preview: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/MenuImage.png?v=1774592103',
    },
    {
      label: 'SERVICES',
      route: '/services',
      preview: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/MenuImage.png?v=1774592103',
    },
    {
      label: 'ABOUT US',
      route: '/about',
      preview: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/MenuImage.png?v=1774592103',
    },
    {
      label: 'CONTACT',
      route: '/contact',
      preview: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/MenuImage.png?v=1774592103',
    },
  ];

  ngOnInit() {
    // Both of these are browser-only, for different reasons.
    //
    // The hours strip answers "are they open right now", which is true for about a minute.
    // Prerendering would freeze one build's answer into every page until the next deploy —
    // a page shipped on a Wednesday morning would keep insisting the salon is closed. The
    // fields start empty and the client fills them in on boot; the authoritative opening
    // hours are in the LocalBusiness schema, which is prerendered and complete.
    //
    // The timer would also stop the build finishing: prerendering ends when the app runs
    // out of pending work, and something that re-arms every minute never gets there.
    if (IS_BROWSER) {
      this.updateHeaderHours();
      setInterval(() => this.updateHeaderHours(), 60_000);
    }

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
    this.setMobileMenu(!this.isMenuOpen);
  }

  private setMobileMenu(open: boolean): void {
    this.isMenuOpen = open;

    if (open) {
      this.lockBodyScroll();
    } else {
      this.unlockBodyScroll();
    }
  }

  /**
   * The mobile menu is a fixed overlay, so without this the document underneath keeps
   * scrolling behind it: on iOS a drag anywhere over the menu moves the page and flashes the
   * scrollbar down the right edge while nothing visible changes. `overflow: hidden` on <body>
   * alone is not enough there — Safari ignores it and scrolls the document anyway — so the
   * body is pinned with `position: fixed` and the offset restored on close.
   */
  private lockBodyScroll(): void {
    if (!IS_BROWSER || this.scrollLocked) return;

    this.lockedScrollY = window.scrollY;

    const body = document.body.style;
    body.position = 'fixed';
    body.top = `-${this.lockedScrollY}px`;
    body.left = '0';
    body.right = '0';
    body.width = '100%';
    body.overflow = 'hidden';

    this.scrollLocked = true;
  }

  private unlockBodyScroll(): void {
    if (!IS_BROWSER || !this.scrollLocked) return;

    const body = document.body.style;
    body.position = '';
    body.top = '';
    body.left = '';
    body.right = '';
    body.width = '';
    body.overflow = '';

    this.scrollLocked = false;

    // html has `scroll-behavior: smooth` globally, which would animate this restore into a
    // visible scroll-back. Suppress it for the one jump.
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, this.lockedScrollY);
    root.style.scrollBehavior = previousBehavior;
  }

  ngOnDestroy(): void {
    // Header is re-created per page, so a navigation from an open menu would otherwise leave
    // <body> pinned and the whole site unscrollable.
    this.unlockBodyScroll();
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

  /**
   * Nav items are real anchors now, so the browser performs the navigation and this only
   * closes the menu. Kept as a method because both menus share the behaviour.
   */
  closeMenus(): void {
    this.setMobileMenu(false);
    this.isDesktopDropdownOpen = false;
  }

  navigateTo(route: string) {
    const item = this.menuItems.find((i) => i.route === route);
    if (item?.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
      this.closeMenus();
      return;
    }

    this.router.navigateByUrl(route);
    this.closeMenus();
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

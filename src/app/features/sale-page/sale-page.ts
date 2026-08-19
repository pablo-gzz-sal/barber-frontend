import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { Shopify } from '../../core/services/shopify';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { Filter } from '../../shared/components/filter/filter';
import { IS_BROWSER } from '../../core/platform';

type CategoryKey = 'all' | 'shampoo' | 'conditioner' | 'treatment' | 'styling';

interface SaleProductVM {
  id: string;
  title: string;
  handle: string;
  imageUrl: string;
  vendor: string;
  productType: string;
  categoryKey: CategoryKey;
  price: number | null;
  compareAtPrice: number | null;
  discountPercent: number;
}

// Sale banner — swap for a real asset when you have one
const SALE_BANNER_URL =
  'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Shop-PageBanner.png?v=1774466087';

@Component({
  selector: 'app-sale-page',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer, Filter],
  templateUrl: './sale-page.html',
})
export class SalePage implements OnInit, OnDestroy {
  // state
  loading = true;
  notFound = false;

  // data
  products: SaleProductVM[] = [];
  saleHeroUrl = SALE_BANNER_URL;

  // filtering
  readonly categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'shampoo', label: 'Shampoo' },
    { key: 'conditioner', label: 'Conditioner' },
    { key: 'treatment', label: 'Treatment' },
    { key: 'styling', label: 'Styling' },
  ];
  selectedCategory: CategoryKey = 'all';

  // pagination
  page = 1;
  readonly pageSize = 24;

  // meta for header
  totalOnSale = 0;

  constructor(
    private shopifyService: Shopify,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSale();
  }

  ngOnDestroy(): void {}

  // ---------- Data ----------

  private loadSale(): void {
    if (IS_BROWSER) window.scrollTo(0, 0);

    this.loading = true;
    this.notFound = false;
    this.products = [];
    this.page = 1;
    this.selectedCategory = 'all';

    // Assumes your ShopifyService exposes getSaleProducts(limit, minDiscount, brand?)
    this.shopifyService
      .getSaleProducts(100, 0)
      .pipe(
        catchError((err) => {
          console.error('Sale page load error:', err);
          this.notFound = err?.status === 404;
          return of(null);
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe((res: any) => {
        if (!res) return;

        const rawProducts = res?.sale ?? [];
        this.products = this.mapProducts(rawProducts);
        this.totalOnSale = res?.count ?? this.products.length;
      });
  }

  // ---------- Mapping ----------

  private mapProducts(raw: any[]): SaleProductVM[] {
    return (raw ?? []).map((p: any) => {
      const image =
        p?.image?.src ??
        p?.images?.[0]?.src ??
        p?.images?.[0]?.url ??
        'assets/images/product-placeholder.png';

      const saleData = p?.sale_data ?? {};
      const price = this.toNumberOrNull(saleData.best_price);
      const compareAtPrice = this.toNumberOrNull(saleData.best_compare_at_price);
      const discountPercent = Number(saleData.discount_percent ?? 0);

      return {
        id: p?.id,
        title: p?.title ?? 'Untitled',
        handle: p?.handle ?? '',
        imageUrl: image,
        vendor: p?.vendor ?? '',
        productType: p?.product_type ?? '',
        categoryKey: this.resolveCategory(p),
        price,
        compareAtPrice,
        discountPercent,
      };
    });
  }

  private resolveCategory(p: any): CategoryKey {
    const haystack = [p?.product_type ?? '', p?.title ?? '', p?.tags ?? '', p?.handle ?? '']
      .join(' ')
      .toLowerCase();

    if (/shampoo/.test(haystack)) return 'shampoo';
    if (/conditioner/.test(haystack)) return 'conditioner';
    if (/(treatment|mask|serum|oil)/.test(haystack)) return 'treatment';
    if (/(style|styling|spray|mousse|gel|cream|pomade)/.test(haystack)) return 'styling';
    return 'all';
  }

  private toNumberOrNull(v: any): number | null {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  // ---------- Filtering / Pagination (derived getters) ----------

  get filteredProducts(): SaleProductVM[] {
    if (this.selectedCategory === 'all') return this.products;
    return this.products.filter((p) => p.categoryKey === this.selectedCategory);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pagedProducts(): SaleProductVM[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // ---------- UI handlers ----------

  onSelectCategory(key: CategoryKey): void {
    this.selectedCategory = key;
    this.page = 1;
  }

  onPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onProduct(handle: string): void {
    if (!handle) return;
    this.router.navigate(['/product', handle]);
  }

  trackById = (_: number, p: SaleProductVM) => p.id ?? p.handle;
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import {
  catchError,
  concatMap,
  delay,
  finalize,
  forkJoin,
  from,
  map,
  of,
  reduce,
  switchMap,
  toArray,
} from 'rxjs';

import { Shopify } from '../../core/services/shopify';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { ShopBestSellers } from '../shop/shop-best-sellers/shop-best-sellers';
import { ActualSale } from '../shop/actual-sale/actual-sale';
import { BRAND_BANNERS } from '../../shared/utils/brandBannerImages';

type CategoryKey = 'all' | 'shampoo' | 'conditioner' | 'styling';
type BrandPageMode = 'single' | 'single-branded' | 'group';

interface BrandVM {
  name: string;
  description: string;
  logoUrl?: string;
}

interface ProductCardVM {
  id: string;
  handle: string;
  vendor?: string;
  title: string;
  imageUrl: string;
  price: string;
  category: CategoryKey;
}

interface CollectionEntryVM {
  handle: string;
  title: string;
  imageUrl: string;
}

interface SubCollectionSummary {
  id: string;
  handle: string;
  title: string;
  description?: string;
  imageUrl: string;
}

/** How many parallel requests to allow at once. Stay at 1-2 to respect the 2 req/s limit. */
const CHUNK_SIZE = 1;
/** Delay in ms between sequential chunks — adds breathing room between requests. */
const CHUNK_DELAY_MS = 600;

@Component({
  selector: 'app-brand-page',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterLink, ShopBestSellers, ActualSale],
  templateUrl: './brand-page.html',
  styleUrl: './brand-page.css',
})
export class BrandPage implements OnInit {
  loading = false;
  notFound = false;

  mode: BrandPageMode = 'single';
  isGroupedBrand = false;

  brandGroup: any | null = null;

  brandHeroUrl = 'assets/images/brand-hero-placeholder.jpg';
  singleCollectionHeroUrl = '';
  singleCollectionFooterUrl = '';
  brandAboutImageUrl = 'assets/images/brand-about-placeholder.jpg';
  signatureUrl = 'assets/svg/blackLogo.svg';

  brand: BrandVM | null = null;
  brandForSale: string | null = null;

  whyWeLoveText = 'Comments from Joey\nClient comments\nWhatever to show authority and POV';

  collectionEntries: CollectionEntryVM[] = [];

  categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'shampoo', label: 'SHAMPOO' },
    { key: 'conditioner', label: 'CONDITIONER' },
    { key: 'styling', label: 'STYLING' },
  ];
  selectedCategory: CategoryKey = 'all';

  private pageSize = 12;
  private page = 1;

  products: ProductCardVM[] = [];

  constructor(
    private route: ActivatedRoute,
    private shopifyService: Shopify,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.loadPage();
    });
  }

  // private loadPage(): void {
  //   window.scrollTo(0, 0);

  //   this.loading = true;
  //   this.notFound = false;
  //   this.collectionEntries = [];
  //   this.products = [];
  //   this.page = 1;
  //   this.selectedCategory = 'all';

  //   const param =
  //     this.route.snapshot.paramMap.get('brandKey') || this.route.snapshot.paramMap.get('handle');

  //   if (!param) {
  //     this.resetBrandImages();
  //     this.loading = false;
  //     return;
  //   }

  //   this.brandForSale = param

  //   this.shopifyService
  //     .getCollections()
  //     .pipe(
  //       switchMap((res: any) => {
  //         const brandGroups = res?.brandGroups ?? [];

  //         const group =
  //           brandGroups.find((g: any) => g.brandKey === param) ??
  //           brandGroups.find(
  //             (g: any) =>
  //               (g.collectionHandles ?? []).includes(param) && (g.collectionIds ?? []).length === 1,
  //           ) ??
  //           null;

  //         if (group) {
  //           return this.loadGroupedOrSingleBrandFromGroup(group);
  //         }

  //         return this.loadSingleCollection(param);
  //       }),
  //       catchError((err) => {
  //         console.error('Brand page load error:', err);
  //         this.notFound = err?.status === 404;
  //         return of({
  //           mode: 'single' as const,
  //           brand: null,
  //           products: [],
  //           collectionEntries: [],
  //           brandHeroUrl: 'assets/images/brand-hero-placeholder.jpg',
  //           brandAboutImageUrl: 'assets/images/brand-about-placeholder.jpg',
  //         });
  //       }),
  //       finalize(() => {
  //         this.loading = false;
  //       }),
  //     )
  //     .subscribe((res: any) => {
  //       this.mode = res?.mode ?? 'single';
  //       this.brand = res?.brand ?? null;
  //       this.products = this.mapProducts(res?.products ?? []);
  //       this.collectionEntries = res?.collectionEntries ?? [];
  //       console.log(this.collectionEntries);

  //       this.brandHeroUrl = res?.brandHeroUrl || 'assets/images/brand-hero-placeholder.jpg';
  //       this.brandAboutImageUrl =
  //         res?.brandAboutImageUrl || 'assets/images/brand-about-placeholder.jpg';
  //     });
  // }

  private loadPage(): void {
    window.scrollTo(0, 0);

    this.loading = true;
    this.notFound = false;
    this.collectionEntries = [];
    this.products = [];
    this.page = 1;
    this.selectedCategory = 'all';

    const handle =
      this.route.snapshot.paramMap.get('brandKey') || this.route.snapshot.paramMap.get('handle');

    if (!handle) {
      this.resetBrandImages();
      this.loading = false;
      return;
    }

    this.brandForSale = handle;

    // SINGLE entry point: fetch the collection by handle
    this.shopifyService
      .getCollectionByHandle(handle)
      .pipe(
        switchMap((res: any) => {
          const collection = res?.collection ?? res;

          if (!collection?.id) {
            this.notFound = true;
            return of(null);
          }

          const subIds = this.parseSubCollectionIds(collection);

          if (subIds.length > 0) {
            return this.loadGroupMode(collection, subIds);
          }

          // Check if this collection has branding metafields configured
          const hasOverview =
            !!this.getImageMetafieldUrl(collection, 'bannerImage') ||
            !!this.getImageMetafieldUrl(collection, 'footerBrand') ||
            !!this.getImageMetafieldUrl(collection, 'overviewCollection');

          return this.loadSingleMode(collection, hasOverview);
        }),
        catchError((err) => {
          console.error('Brand page load error:', err);
          this.notFound = err?.status === 404;
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res: any) => {
        if (!res) return;

        this.mode = res.mode;
        this.isGroupedBrand = res.mode === 'group';
        this.brand = res.brand ?? null;
        this.products = this.mapProducts(res.products ?? []);
        this.collectionEntries = res.collectionEntries ?? [];

        this.brandHeroUrl = res.brandHeroUrl || 'assets/images/brand-hero-placeholder.jpg';
        this.brandAboutImageUrl =
          res.brandAboutImageUrl || 'assets/images/brand-about-placeholder.jpg';
      });
  }

  private loadGroupMode(collection: any, subIds: string[]) {
    this.brandGroup = collection;
    console.log(collection);
    console.log(subIds);
    
    
    const brand: BrandVM = {
      name: collection.title,
      description: this.stripHtml(collection.body_html ?? collection.description ?? ''),
      logoUrl: collection?.image?.src ?? collection?.image?.url ?? '',
    };

    const brandHeroUrl =
      BRAND_BANNERS[collection.handle?.toLowerCase()] ||
      BRAND_BANNERS[collection.title?.toLowerCase()] ||
      this.getImageMetafieldUrl(collection, 'bannerImage') ||
      'assets/images/brand-hero-placeholder.jpg';

    const brandAboutImageUrl =
      this.getImageMetafieldUrl(collection, 'footerBrand') ||
      'assets/images/brand-about-placeholder.jpg';

    // Fetch summaries for each subCollection — ideally ONE backend call,
    // but falls back to individual calls if the helper returns an array.
    return this.shopifyService.getSubCollectionsSummary(subIds).pipe(
      map((subs: SubCollectionSummary[]) => ({
        mode: 'group' as BrandPageMode,
        brand,
        products: [], // group mode shows no products
        collectionEntries: subs.map((s) => ({
          handle: s.handle,
          title: s.title,
          imageUrl: s.imageUrl,
        })) as CollectionEntryVM[],
        brandHeroUrl,
        brandAboutImageUrl,
      })),
      catchError(() =>
        of({
          mode: 'group' as BrandPageMode,
          brand,
          products: [],
          collectionEntries: [],
          brandHeroUrl,
          brandAboutImageUrl,
        }),
      ),
    );
  }

  private parseSubCollectionIds(collection: any): string[] {
    const raw = this.getMetafieldValue(collection, 'subCollections');
    if (!raw) return [];

    // Shopify metafield of type list.collection_reference returns either:
    //  - an array of GIDs: ["gid://shopify/Collection/123", ...]
    //  - a JSON-stringified array of GIDs
    //  - already-resolved references (object with .id)
    let parsed: any = raw;
    if (typeof raw === 'string') {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = [raw];
      }
    }

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item: any) => {
        if (typeof item === 'string') return this.extractNumericId(item);
        if (item?.id) return this.extractNumericId(String(item.id));
        return '';
      })
      .filter(Boolean);
  }

  private extractNumericId(gidOrId: string): string {
    const match = gidOrId.match(/(\d+)$/);
    return match ? match[1] : gidOrId;
  }

  private loadSingleMode(collection: any, branded = false) {
    this.brandGroup = null;
    this.isGroupedBrand = false;

    const img = collection?.image?.src ?? collection?.image?.url ?? '';

    const brand: BrandVM = {
      name: collection.title,
      description: this.stripHtml(collection.body_html ?? collection.description ?? ''),
      logoUrl: img,
    };

    const brandHeroUrl =
      BRAND_BANNERS[collection.handle?.toLowerCase()] ||
      this.getImageMetafieldUrl(collection, 'bannerImage') ||
      'assets/images/brand-hero-placeholder.jpg';

    const brandAboutImageUrl =
      this.getImageMetafieldUrl(collection, 'footerBrand') ||
      'assets/images/brand-about-placeholder.jpg';

    this.singleCollectionHeroUrl = brandHeroUrl;
    this.singleCollectionFooterUrl = brandAboutImageUrl;

    return this.shopifyService.getCollectionProducts(String(collection.id)).pipe(
      map((r: any) => ({
        mode: (branded ? 'single-branded' : 'single') as BrandPageMode,
        brand,
        products: r?.products ?? [],
        collectionEntries: [],
        brandHeroUrl,
        brandAboutImageUrl,
      })),
      catchError(() =>
        of({
          mode: (branded ? 'single-branded' : 'single') as BrandPageMode,
          brand,
          products: [],
          collectionEntries: [],
          brandHeroUrl,
          brandAboutImageUrl,
        }),
      ),
    );
  }

  /**
   * Executes requests one at a time (concatMap) with a delay between each.
   * Replaces forkJoin for cases where parallel calls exceed the API rate limit.
   *
   * @param items  Array of inputs to iterate over
   * @param factory Function that turns one input into an Observable
   */
  private sequentialRequests<T, R>(items: T[], factory: (item: T) => import('rxjs').Observable<R>) {
    return from(items).pipe(
      concatMap((item, index) => {
        // Skip the delay for the very first request
        const delayMs = index === 0 ? 0 : CHUNK_DELAY_MS;
        return of(item).pipe(
          delay(delayMs),
          switchMap((i) => factory(i)),
        );
      }),
      toArray(),
    );
  }

  /**
   * Loads products for multiple collection IDs sequentially to avoid rate limits.
   * Previously used forkJoin which fired all requests simultaneously.
   */
  // private loadProductsForGroupedCollections(ids: string[]) {
  //   if (!ids.length) return of([]);

  //   return this.sequentialRequests(ids, (id) =>
  //     this.shopifyService.getCollectionProducts(id).pipe(
  //       map((r: any) => r?.products ?? []),
  //       catchError(() => of([])),
  //     ),
  //   ).pipe(
  //     map((lists) => {
  //       const flat = (lists as any[][]).flat();
  //       const mapById = new Map<string, any>();
  //       for (const p of flat) mapById.set(String(p.id), p);
  //       return Array.from(mapById.values());
  //     }),
  //   );
  // }

  // private pickRepresentativeCollection(collections: any[]): any | null {
  //   if (!Array.isArray(collections) || !collections.length) return null;

  //   return (
  //     collections.find((c) => this.getImageMetafieldUrl(c, 'brandImage')) ||
  //     collections.find((c) => this.getImageMetafieldUrl(c, 'footerBrand')) ||
  //     collections[0] ||
  //     null
  //   );
  // }

  private mapProducts(list: any[]): ProductCardVM[] {
    return list.map((p: any) => {
      const imageUrl =
        p.image?.src ??
        p.image?.url ??
        p.images?.[0]?.src ??
        p.images?.[0]?.url ??
        'assets/images/product-placeholder.jpg';

      const priceRaw = p.price ?? p?.variants?.[0]?.price ?? '';
      const price =
        typeof priceRaw === 'string' && priceRaw
          ? `$${priceRaw}`.replace('$$', '$')
          : priceRaw
            ? String(priceRaw)
            : '';

      return {
        id: String(p.id),
        handle: p.handle,
        vendor: p.vendor,
        title: p.title,
        imageUrl,
        price,
        category: this.deriveCategoryFromProduct(p),
      };
    });
  }

  goBack(): void {
    this.location.back();
  }

  selectCategory(key: CategoryKey): void {
    this.selectedCategory = key;
    this.page = 1;
  }

  get filteredProducts(): ProductCardVM[] {
    if (this.selectedCategory === 'all') return this.products;
    return this.products.filter((p) => p.category === this.selectedCategory);
  }

  get visibleProducts(): ProductCardVM[] {
    return this.filteredProducts.slice(0, this.pageSize * this.page);
  }

  get canLoadMore(): boolean {
    return this.visibleProducts.length < this.filteredProducts.length;
  }

  loadMore(): void {
    this.page += 1;
  }

  private normalizeTags(tags: any): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean);

    return String(tags)
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }

  private deriveCategoryFromProduct(p: any): CategoryKey {
    const tags = this.normalizeTags(p.tags);
    const title = String(p.title ?? '').toLowerCase();
    const haystack = [...tags, title].join(' ');

    if (haystack.includes('shampoo')) return 'shampoo';
    if (haystack.includes('conditioner')) return 'conditioner';
    if (
      haystack.includes('styling') ||
      haystack.includes('style') ||
      haystack.includes('mousse') ||
      haystack.includes('spray') ||
      haystack.includes('gel') ||
      haystack.includes('cream') ||
      haystack.includes('paste') ||
      haystack.includes('wax') ||
      haystack.includes('dry shampoo')
    ) {
      return 'styling';
    }

    return 'all';
  }

  private stripHtml(input: string): string {
    return String(input)
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  private resetBrandImages(): void {
    this.brandHeroUrl = 'assets/images/brand-hero-placeholder.jpg';
    this.brandAboutImageUrl = 'assets/images/brand-about-placeholder.jpg';
  }

  private getImageMetafieldUrl(source: any, key: string): string {
    const raw = this.getMetafieldValue(source, key);
    if (!raw) return '';

    if (typeof raw === 'string' && (raw.startsWith('http://') || raw.startsWith('https://'))) {
      return raw;
    }

    if (typeof raw === 'object') {
      return (
        raw?.url ||
        raw?.src ||
        raw?.image?.url ||
        raw?.image?.src ||
        raw?.reference?.image?.url ||
        raw?.reference?.image?.src ||
        ''
      );
    }

    if (typeof raw === 'string' && (raw.startsWith('{') || raw.startsWith('['))) {
      try {
        const parsed = JSON.parse(raw);
        return this.getImageMetafieldUrl({ metafields: [{ key, value: parsed }] }, key);
      } catch {
        return '';
      }
    }

    return '';
  }

  private getMetafieldValue(source: any, key: string): any {
    if (!source) return '';

    // Direct property — try exact match first, then case-insensitive
    if (key in source) return source[key];
    const lowerKey = key.toLowerCase();
    const directMatch = Object.keys(source).find((k) => k.toLowerCase() === lowerKey);
    if (directMatch) return source[directMatch];

    const metafields = source?.metafields;
    if (!metafields) return '';

    if (Array.isArray(metafields)) {
      const found = metafields.find((m: any) => m?.key?.toLowerCase() === lowerKey);
      return found?.value ?? '';
    }

    if (Array.isArray(metafields?.edges)) {
      const found = metafields.edges.find(
        (e: any) => e?.node?.key?.toLowerCase() === lowerKey,
      )?.node;
      return found?.value ?? '';
    }

    if (metafields?.[key]) {
      return metafields[key]?.value ?? metafields[key];
    }

    // Case-insensitive fallback on metafields object keys
    const metaMatch = Object.keys(metafields).find((k) => k.toLowerCase() === lowerKey);
    if (metaMatch) {
      return metafields[metaMatch]?.value ?? metafields[metaMatch];
    }

    if (metafields?.custom?.[key]) {
      return metafields.custom[key]?.value ?? metafields.custom[key];
    }

    const customMatch = metafields?.custom
      ? Object.keys(metafields.custom).find((k) => k.toLowerCase() === lowerKey)
      : null;
    if (customMatch) {
      return metafields.custom[customMatch]?.value ?? metafields.custom[customMatch];
    }

    return '';
  }
}

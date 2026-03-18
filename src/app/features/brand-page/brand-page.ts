import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';

import { Shopify } from '../../core/services/shopify';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { ShopBestSellers } from '../shop/shop-best-sellers/shop-best-sellers';
import { ActualSale } from '../shop/actual-sale/actual-sale';

type CategoryKey = 'all' | 'shampoo' | 'conditioner' | 'styling';
type BrandPageMode = 'single' | 'group';

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
  brandAboutImageUrl = 'assets/images/brand-about-placeholder.jpg';
  signatureUrl = 'assets/svg/blackLogo.svg';

  brand: BrandVM | null = null;

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

  private loadPage(): void {
    window.scrollTo(0, 0);

    this.loading = true;
    this.notFound = false;
    this.collectionEntries = [];
    this.products = [];
    this.page = 1;
    this.selectedCategory = 'all';

    const param =
      this.route.snapshot.paramMap.get('brandKey') || this.route.snapshot.paramMap.get('handle');

    if (!param) {
      this.resetBrandImages();
      this.loading = false;
      return;
    }

    this.shopifyService
      .getCollections()
      .pipe(
        switchMap((res: any) => {
          const brandGroups = res?.brandGroups ?? [];

          const group =
            brandGroups.find((g: any) => g.brandKey === param) ??
            brandGroups.find(
              (g: any) =>
                (g.collectionHandles ?? []).includes(param) && (g.collectionIds ?? []).length === 1,
            ) ??
            null;

          if (group) {
            return this.loadGroupedOrSingleBrandFromGroup(group);
          }

          const parentGroup =
            brandGroups.find(
              (g: any) =>
                (g.collectionHandles ?? []).includes(param) && (g.collectionIds ?? []).length > 1,
            ) ?? null;

          return this.loadSingleCollection(param, parentGroup);
        }),
        catchError((err) => {
          console.error('Brand page load error:', err);
          this.notFound = err?.status === 404;
          return of({
            mode: 'single' as const,
            brand: null,
            products: [],
            collectionEntries: [],
            brandHeroUrl: 'assets/images/brand-hero-placeholder.jpg',
            brandAboutImageUrl: 'assets/images/brand-about-placeholder.jpg',
          });
        }),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res: any) => {
        this.mode = res?.mode ?? 'single';
        this.brand = res?.brand ?? null;
        this.products = this.mapProducts(res?.products ?? []);
        this.collectionEntries = res?.collectionEntries ?? [];
        this.brandHeroUrl = res?.brandHeroUrl || 'assets/images/brand-hero-placeholder.jpg';
        this.brandAboutImageUrl =
          res?.brandAboutImageUrl || 'assets/images/brand-about-placeholder.jpg';
      });
  }

  private loadGroupedOrSingleBrandFromGroup(group: any) {
    this.brandGroup = group;

    const ids: string[] = group.collectionIds ?? [];
    const handles: string[] = group.collectionHandles ?? [];
    const titles: string[] = group.collectionTitles ?? [];

    const isGrouped = ids.length > 1;

    this.isGroupedBrand = isGrouped;
    this.mode = isGrouped ? 'group' : 'single';

    const collectionDetailCalls = handles.map((handle) =>
      this.shopifyService.getCollectionByHandle(handle).pipe(catchError(() => of(null))),
    );

    const collectionDetails$ = handles.length ? forkJoin(collectionDetailCalls) : of([]);

    const products$ = isGrouped
      ? this.loadProductsForGroupedCollections(ids)
      : ids[0]
        ? this.shopifyService.getCollectionProducts(ids[0]).pipe(
            map((r: any) => r?.products ?? []),
            catchError(() => of([])),
          )
        : of([]);

    return forkJoin({
      collectionDetails: collectionDetails$,
      products: products$,
    }).pipe(
      map(({ collectionDetails, products }) => {
        const representativeCollection = this.pickRepresentativeCollection(collectionDetails);
        const hero = group?.hero ?? {};

        const brand: BrandVM = {
          name: group.brandTitle ?? hero.title ?? representativeCollection?.title ?? 'Brand',
          description: this.stripHtml(
            hero.body_html ??
              hero.description ??
              representativeCollection?.body_html ??
              representativeCollection?.description ??
              '',
          ),
          logoUrl:
            hero?.image?.src ??
            hero?.image?.url ??
            representativeCollection?.image?.src ??
            representativeCollection?.image?.url ??
            '',
        };

        const brandHeroUrl =
          this.getImageMetafieldUrl(group, 'brandImage') ||
          this.getImageMetafieldUrl(representativeCollection, 'brandImage') ||
          'assets/images/brand-hero-placeholder.jpg';

        const brandAboutImageUrl =
          this.getImageMetafieldUrl(group, 'footerBrand') ||
          this.getImageMetafieldUrl(representativeCollection, 'footerBrand') ||
          'assets/images/brand-about-placeholder.jpg';

        const collectionEntries = isGrouped
          ? handles.map((handle, index) => {
              const detail = collectionDetails[index];
              return {
                handle,
                title: titles[index] ?? detail?.title ?? handle,
                imageUrl:
                  this.getImageMetafieldUrl(detail, 'overviewCollection') ||
                  group?.collectionImages?.[index] ||
                  detail?.image?.src ||
                  detail?.image?.url ||
                  '',
              };
            })
          : [];

        return {
          mode: isGrouped ? 'group' : 'single',
          brand,
          products,
          collectionEntries,
          brandHeroUrl,
          brandAboutImageUrl,
        };
      }),
    );
  }

  private loadSingleCollection(handle: string, parentGroup: any | null) {
    this.brandGroup = null;
    this.isGroupedBrand = false;
    this.mode = 'single';

    return this.shopifyService.getCollectionByHandle(handle).pipe(
      switchMap((res: any) => {
        const collection = res?.collection ?? res;

        if (!collection?.id) {
          console.warn('Single collection response missing id:', res);
          return of({
            mode: 'single' as const,
            products: [],
            brand: null,
            brandGroup: null,
          });
        }

        const img = collection?.image?.src ?? collection?.image?.url ?? '';

        this.brand = {
          name: collection.title,
          description: this.stripHtml(collection.body_html ?? collection.description ?? ''),
          logoUrl: img,
        };

        this.brandHeroUrl =
          this.getImageMetafieldUrl(collection, 'brandImage') ||
          'assets/images/brand-hero-placeholder.jpg';

        this.brandAboutImageUrl =
          this.getImageMetafieldUrl(collection, 'footerBrand') ||
          'assets/images/brand-about-placeholder.jpg';

        return this.shopifyService.getCollectionProducts(String(collection.id)).pipe(
          map((r: any) => ({
            mode: 'single' as const,
            products: r?.products ?? [],
            brand: this.brand,
            brandGroup: null,
          })),
          catchError((error) => {
            console.error('Failed to load products for collection', collection.id, error);
            return of({
              mode: 'single' as const,
              products: [],
              brand: this.brand,
              brandGroup: null,
            });
          }),
        );
      }),
    );
  }

  private loadProductsForGroupedCollections(ids: string[]) {
    if (!ids.length) return of([]);

    const calls = ids.map((id) =>
      this.shopifyService.getCollectionProducts(id).pipe(
        map((r: any) => r?.products ?? []),
        catchError(() => of([])),
      ),
    );

    return forkJoin(calls).pipe(
      map((lists) => {
        const flat = lists.flat();
        const mapById = new Map<string, any>();

        for (const p of flat) {
          mapById.set(String(p.id), p);
        }

        return Array.from(mapById.values());
      }),
    );
  }

  private pickRepresentativeCollection(collections: any[]): any | null {
    if (!Array.isArray(collections) || !collections.length) return null;

    return (
      collections.find((c) => this.getImageMetafieldUrl(c, 'brandImage')) ||
      collections.find((c) => this.getImageMetafieldUrl(c, 'footerBrand')) ||
      collections[0] ||
      null
    );
  }

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

    if (key in source) return source[key];

    const metafields = source?.metafields;
    if (!metafields) return '';

    if (Array.isArray(metafields)) {
      const found = metafields.find((m: any) => m?.key === key);
      return found?.value ?? '';
    }

    if (Array.isArray(metafields?.edges)) {
      const found = metafields.edges.find((e: any) => e?.node?.key === key)?.node;
      return found?.value ?? '';
    }

    if (metafields?.[key]) {
      return metafields[key]?.value ?? metafields[key];
    }

    if (metafields?.custom?.[key]) {
      return metafields.custom[key]?.value ?? metafields.custom[key];
    }

    return '';
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, map, of, switchMap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Shopify } from '../../core/services/shopify';
import { CommonModule } from '@angular/common';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';

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

@Component({
  selector: 'app-brand-page',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterLink],
  templateUrl: './brand-page.html',
  styleUrl: './brand-page.css',
})
export class BrandPage implements OnInit {
  loading = false;

  mode: BrandPageMode = 'single';
  isGroupedBrand = false;

  brandGroup: any | null = null;

  brandHeroUrl = 'assets/images/brand-hero-placeholder.jpg';
  brandAboutImageUrl = 'assets/images/brand-about-placeholder.jpg';
  signatureUrl = 'assets/svg/blackLogo.svg';

  brand: BrandVM | null = null;

  whyWeLoveText = 'Comments from Joey\nClient comments\nWhatever to show authority and POV';

  collectionEntries: { handle: string; title: string; imageUrl: string }[] = [];

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
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.loading = true;

    this.route.paramMap
      .pipe(
        map((params) => params.get('brandKey') || params.get('handle')),
        switchMap((param) => {
          if (!param)
            return of({ mode: 'single' as const, products: [], brand: null, brandGroup: null });

          return this.shopifyService.getCollections().pipe(
            switchMap((res: any) => {
              const brandGroups = res?.brandGroups ?? [];
              const group =
                brandGroups.find((g: any) => g.brandKey === param) ??
                brandGroups.find(
                  (g: any) =>
                    (g.collectionHandles ?? []).includes(param) &&
                    (g.collectionIds ?? []).length === 1,
                ) ??
                null;

              if (group) {
                this.brandGroup = group;

                const ids: string[] = group.collectionIds ?? [];
                const isGrouped = ids.length > 1;

                this.isGroupedBrand = isGrouped;
                this.mode = isGrouped ? 'group' : 'single';

                const hero = group.hero ?? {};
                const heroImg = hero?.image?.src ?? hero?.image?.url ?? null;

                this.brand = {
                  name: group.brandTitle ?? hero.title ?? 'Brand',
                  description: this.stripHtml(hero.body_html ?? hero.description ?? ''),
                  logoUrl: heroImg ?? '',
                };

                if (heroImg) {
                  this.brandHeroUrl = this.buildBrandCoverUpperImage(this.brand?.name);
                  this.brandAboutImageUrl = this.buildBrandBottomImage(this.brand?.name);
                }

                if (!isGrouped) {
                  const singleId = ids[0];
                  if (!singleId) {
                    return of({
                      mode: 'single' as const,
                      products: [],
                      brand: this.brand,
                      brandGroup: group,
                    });
                  }

                  return this.shopifyService.getCollectionProducts(singleId).pipe(
                    map((r: any) => ({
                      mode: 'single' as const,
                      products: r?.products ?? [],
                      brand: this.brand,
                      brandGroup: group,
                    })),
                  );
                }

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
                    for (const p of flat) mapById.set(String(p.id), p);

                    return {
                      mode: 'group' as const,
                      products: Array.from(mapById.values()),
                      brand: this.brand,
                      brandGroup: group,
                    };
                  }),
                );
              }
              this.brandGroup = null;
              this.isGroupedBrand = false;
              this.mode = 'single';

              return this.shopifyService.getCollectionByHandle(param).pipe(
                switchMap((collection: any) => {
                  if (!collection?.id) {
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
                    description: this.stripHtml(
                      collection.body_html ?? collection.description ?? '',
                    ),
                    logoUrl: img,
                  };

                  if (img) {
                    this.brandHeroUrl = this.buildBrandCoverUpperImage(this.brand?.name);
                    this.brandAboutImageUrl = this.buildBrandBottomImage(this.brand?.name);
                  }

                  return this.shopifyService.getCollectionProducts(collection.id).pipe(
                    map((r: any) => ({
                      mode: 'single' as const,
                      products: r?.products ?? [],
                      brand: this.brand,
                      brandGroup: null,
                    })),
                  );
                }),
              );
            }),
          );
        }),
        catchError((err) => {
          console.error('Brand page load error:', err);
          return of({ mode: 'single' as const, products: [], brand: null, brandGroup: null });
        }),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((res) => {
        this.loading = false;

        // Build collection entries for group mode
        if (res.mode === 'group' && this.brandGroup) {
          const handles: string[] = this.brandGroup.collectionHandles ?? [];
          const titles: string[] = this.brandGroup.collectionTitles ?? [];
          const images: string[] = this.brandGroup.collectionImages ?? [];
          this.collectionEntries = handles.map((h, i) => ({
            handle: h,
            title: titles[i] ?? h,
            imageUrl: images[i] ?? '',
          }));
        } else {
          this.collectionEntries = [];
        }
        const list = res?.products ?? [];
        this.products = list.map((p: any) => {
          const imageUrl =
            p.image?.src ??
            p.image?.url ??
            p.images?.[0]?.src ??
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
        this.page = 1;
        this.selectedCategory = 'all';
      });
  }

  selectCategory(key: CategoryKey) {
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

  loadMore() {
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

  private buildBrandBottomImage(brandName: string | undefined | null): string {
    if (!brandName) return 'assets/images/brand-about-placeholder.jpg';

    // Normalize brand name to match file naming convention
    const normalized = brandName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/['’]/g, '') // remove apostrophes (L'ANZA -> lanza)
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]/g, ''); // remove spaces & special chars

    return `assets/images/brands/${normalized}Brand.jpg`;
  }

  private buildBrandCoverUpperImage(brandName: string | undefined | null): string {
    if (!brandName) return 'assets/images/brand-about-placeholder.jpg';

    // Normalize brand name to match file naming convention
    const normalized = brandName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/['’]/g, '') // remove apostrophes (L'ANZA -> lanza)
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]/g, ''); // remove spaces & special chars

    return `assets/images/coverBrands/${normalized}BrandCover.jpg`;
  }
}

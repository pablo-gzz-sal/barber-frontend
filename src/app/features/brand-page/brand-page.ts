import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { Shopify } from '../../core/services/shopify';
import { map, switchMap, catchError, of } from 'rxjs';

type CategoryKey = 'all' | 'shampoo' | 'conditioner' | 'styling';

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
  price: string; // keep as formatted "$32.00"
  category?: Exclude<CategoryKey, 'all'>;
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

  // top visuals
  brandHeroUrl = 'assets/images/brand-hero-placeholder.jpg';
  brandAboutImageUrl = 'assets/images/brand-about-placeholder.jpg';
  signatureUrl = 'assets/images/signature-placeholder.png';

  brand: BrandVM | null = {
    name: 'ALTERNA',
    logoUrl: 'assets/svg/alterna.svg',
    description:
      'ALTERNA Haircare is a luxury haircare brand blending clean, skincare-inspired science with high-performance results. Since 1997, their salon-trusted formulas—free from harsh chemicals like parabens and sulfates—combine potent botanicals and innovative tech to nourish, protect, and transform hair with every use.',
  };

  whyWeLoveText = 'Comments from Joey\nClient comments\nWhatever to show authority and POV';

  // filters
  categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'shampoo', label: 'SHAMPOO' },
    { key: 'conditioner', label: 'CONDITIONER' },
    { key: 'styling', label: 'STYLING' },
  ];
  selectedCategory: CategoryKey = 'all';

  // products + pagination
  private pageSize = 12;
  private page = 1;

  products: ProductCardVM[] = [
    // Replace with real Shopify products
    {
      id: '1',
      handle: 'sheer-dry-shampoo',
      vendor: 'ALTERNA',
      title: 'Sheer dry shampoo',
      imageUrl: 'https://placehold.co/600x600',
      price: '$32.00',
      category: 'styling',
    },
    {
      id: '2',
      handle: 'caviar-anti-aging-shampoo',
      vendor: 'ALTERNA',
      title: 'Caviar Anti-Aging Shampoo',
      imageUrl: 'https://placehold.co/600x600',
      price: '$34.00',
      category: 'shampoo',
    },
    // ...add more
  ];

  constructor(
    private route: ActivatedRoute,
    private shopifyService: Shopify,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.route.paramMap
      .pipe(
        map((params) => params.get('handle')),
        switchMap((handle) => {
          if (!handle) return of(null);

          return this.shopifyService.getCollectionByHandle(handle).pipe(
            switchMap((collection) => {
              if (!collection?.id) return of(null);

              // fetch products after we have the collection id
              return this.shopifyService
                .getCollectionProducts(collection.id)
                .pipe(map((products) => ({ collection, products })));
            }),
          );
        }),
        catchError((err) => {
          console.error('Brand page load error:', err);
          return of(null);
        }),
      )
      .subscribe((res) => {
        if (!res) return;

        const { collection, products } = res;

        this.brand = {
          name: collection.title,
          description: collection.description ?? '',
          logoUrl: collection.image?.url ?? collection.image?.src ?? '',
        };


        const list = Array.isArray(products)
          ? products
          : (products?.products ?? products?.nodes ?? products?.data ?? []);

        this.products = (list ?? []).map((p: any) => {
          const imageUrl =
            p.featuredImage?.url ??
            p.image?.src ??
            p.image?.url ??
            p.images?.nodes?.[0]?.url ??
            'assets/images/product-placeholder.jpg';

          const price = p.variants?.[0]?.price ?? '';
          return {
            id: String(p.id),
            handle: p.handle,
            vendor: p.vendor,
            title: p.title,
            imageUrl,
            price: typeof price === 'string' ? `$${price}`.replace('$$', '$') : String(price),
            category: this.deriveCategoryFromProduct(p),
          };
        });
      });
  }

  private deriveCategory(p: any): 'all' | 'shampoo' | 'conditioner' | 'styling' {
    const type = String(p.productType ?? p.product_type ?? '').toLowerCase();
    const tags: string[] = Array.isArray(p.tags)
      ? p.tags.map((t: any) => String(t).toLowerCase())
      : [];

    const haystack = [type, ...tags].join(' ');

    if (haystack.includes('shampoo')) return 'shampoo';
    if (haystack.includes('conditioner')) return 'conditioner';
    if (haystack.includes('style') || haystack.includes('styling')) return 'styling';

    return 'all';
  }

  selectCategory(key: CategoryKey) {
    this.selectedCategory = key;
    this.page = 1; // reset pagination on filter change
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
    // Shopify REST often returns comma-separated string
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

    // styling signals
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
    )
      return 'styling';

    return 'all';
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductCard } from '../../shared/models/Product-Card.model';

export type ProductStatus = 'active' | 'archived' | 'draft';

export interface ProductQuery {
  limit?: number; // default backend: 10
  collectionId?: string; // optional
  status?: ProductStatus; // optional
}

export interface CollectionQuery {
  limit?: number; // default backend: 50
  title?: string; // optional
}

export interface CustomerQuery {
  limit?: number; // default backend: 50
  email?: string;
  phone?: string;
}

export interface CreateCustomerDto {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  accepts_marketing?: boolean;
  tags?: string; // comma-separated
}

export interface CreateOrderDto {
  email: string;
  line_items: Array<{
    variant_id: string;
    quantity: number;
  }>;
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    city: string;
    province: string;
    country: string;
    zip: string;
  };
}

export interface CreateGiftCardDto {
  initial_value: number;
  customer_id?: string;
  note?: string;
}

export interface CreateSmartCollectionDto {
  title: string;
  body_html?: string;
  rules: Array<{
    column: string;
    relation: string;
    condition: string;
  }>;
  disjunctive?: boolean;
  sort_order?: string;
  published?: boolean;
}

export interface CreateMetafieldDto {
  namespace: string;
  key: string;
  value: string; // ex: '["123","456"]'
  type: string; // ex: 'json'
  description?: string;
}

export type ProductVariantLite = {
  id: string;
  title: string;
  price: string;
  option1?: string;
  option2?: string;
  option3?: string;
  image_id?: string | number | null;
};

export type ProductVariantsResponse = {
  productId: string;
  count: number;
  variants: ProductVariantLite[];
};

interface CachedStream<T> {
  obs$: Observable<T>;
  expiresAt: number;
}
@Injectable({
  providedIn: 'root',
})
export class Shopify {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/shopify`;

  // ── Cache TTLs (ms) ───────────────────────────────────────────────────────
  private readonly TTL = {
    collections: 5 * 60_000, // 5 min — rarely changes
    collectionProducts: 2 * 60_000, // 2 min
    bestsellers: 5 * 60_000, // 5 min — expensive to compute
    sale: 3 * 60_000, // 3 min
  };

  // ── Internal cache map ────────────────────────────────────────────────────
  private cache = new Map<string, CachedStream<any>>();

  /**
   * Returns a cached observable for `key`, or creates one via `factory`.
   * The observable is shared and replayed so all subscribers get the same
   * response without firing extra HTTP requests.
   */
  private cached<T>(key: string, ttlMs: number, factory: () => Observable<T>): Observable<T> {
    const entry = this.cache.get(key);
    if (entry && Date.now() < entry.expiresAt) {
      return entry.obs$ as Observable<T>;
    }

    const obs$ = factory().pipe(
      shareReplay(1),
      catchError((e) => {
        // Evict on error so the next call retries instead of replaying the error
        this.cache.delete(key);
        return this.handleError(e);
      }),
    );

    this.cache.set(key, { obs$, expiresAt: Date.now() + ttlMs });
    return obs$;
  }

  /** Manually bust one key or the entire cache (call after a write operation). */
  invalidateCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // -------------------------
  // Helpers
  // -------------------------
  private toHttpParams(obj?: Record<string, any>): HttpParams {
    let params = new HttpParams();
    if (!obj) return params;

    Object.entries(obj).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== undefined && v !== null) params = params.append(key, String(v));
        });
        return;
      }

      params = params.set(key, String(value));
    });

    return params;
  }

  private handleError(err: HttpErrorResponse) {
    return throwError(() => err);
  }

  // =========================
  // HEALTH
  // =========================
  healthCheck(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`).pipe(catchError((e) => this.handleError(e)));
  }

  // =========================
  // PRODUCTS
  // =========================
  getProducts(query?: ProductQuery): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/products`, { params: this.toHttpParams(query) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  searchProducts(query: string, limit = 20): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/products/search`, {
        params: this.toHttpParams({ query, limit }),
      })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getProductById(id: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/products/${encodeURIComponent(id)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  getProductsByTag(tag: string, limit = 50): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/products/by-tag/${encodeURIComponent(tag)}`, {
        params: this.toHttpParams({ limit }),
      })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getProductRecommendations(productId: string, limit = 4): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/products/${encodeURIComponent(productId)}/recommendations`, {
        params: this.toHttpParams({ limit }),
      })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getRelatedProducts(productId: string, limit = 4): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/products/${encodeURIComponent(productId)}/related`, {
        params: this.toHttpParams({ limit }),
      })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getProductMetafields(productId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/products/${encodeURIComponent(productId)}/metafields`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  createProductMetafield(productId: string, data: CreateMetafieldDto): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/products/${encodeURIComponent(productId)}/metafields`, data)
      .pipe(catchError((e) => this.handleError(e)));
  }

  // =========================
  // COLLECTIONS
  // =========================

  /**
   * Cached — the most expensive call in the app.
   * All brand-page navigations within the TTL window share one HTTP request.
   */
  getCollections(query?: CollectionQuery): Observable<any> {
    // Include query params in the key so different filters don't collide
    const key = `collections:${JSON.stringify(query ?? {})}`;
    return this.cached(key, this.TTL.collections, () =>
      this.http.get(`${this.baseUrl}/collections`, {
        params: this.toHttpParams(query),
      }),
    );
  }

  getCollectionById(id: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/collections/${encodeURIComponent(id)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  /**
   * Cached per collection ID + limit.
   * Brand pages call this once per collection; subsequent visits replay.
   */
  getCollectionProducts(id: string, limit = 50): Observable<any> {
    const key = `col-products:${id}:${limit}`;
    return this.cached(key, this.TTL.collectionProducts, () =>
      this.http.get(`${this.baseUrl}/collections/${encodeURIComponent(id)}/products`, {
        params: this.toHttpParams({ limit }),
      }),
    );
  }

  getCollectionByHandle(handle: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/collections/by-handle/${encodeURIComponent(handle)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  getFeaturedProducts(collections: string[], limitPerCollection = 4): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/featured-products`, { collections, limitPerCollection })
      .pipe(catchError((e) => this.handleError(e)));
  }

  // =========================
  // CUSTOMERS
  // =========================
  getCustomers(query?: CustomerQuery): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/customers`, { params: this.toHttpParams(query) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getCustomerSegments(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/customers/segments`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  getCustomerById(id: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/customers/${encodeURIComponent(id)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  createCustomer(data: CreateCustomerDto): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/customers`, data)
      .pipe(catchError((e) => this.handleError(e)));
  }

  updateCustomer(id: string, data: Partial<CreateCustomerDto>): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/customers/${encodeURIComponent(id)}`, data)
      .pipe(catchError((e) => this.handleError(e)));
  }

  getCustomerOrders(id: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/customers/${encodeURIComponent(id)}/orders`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  // =========================
  // GIFT CARDS
  // =========================
  getGiftCards(limit = 50): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/gift-cards`, { params: this.toHttpParams({ limit }) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getGiftCardById(id: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/gift-cards/${encodeURIComponent(id)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  createGiftCard(data: CreateGiftCardDto): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/gift-cards`, data)
      .pipe(catchError((e) => this.handleError(e)));
  }

  disableGiftCard(id: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/gift-cards/${encodeURIComponent(id)}/disable`, {})
      .pipe(catchError((e) => this.handleError(e)));
  }

  // =========================
  // ORDERS
  // =========================
  createOrder(data: CreateOrderDto): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/orders`, data)
      .pipe(catchError((e) => this.handleError(e)));
  }

  getOrders(limit = 50, status?: 'open' | 'closed' | 'cancelled' | 'any'): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/orders`, { params: this.toHttpParams({ limit, status }) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getOrderById(id: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/orders/${encodeURIComponent(id)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  // =========================
  // SMART COLLECTIONS
  // =========================
  getSmartCollections(limit = 50): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/smart-collections`, { params: this.toHttpParams({ limit }) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getSmartCollectionById(id: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/smart-collections/${encodeURIComponent(id)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  createSmartCollection(data: CreateSmartCollectionDto): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/smart-collections`, data)
      .pipe(catchError((e) => this.handleError(e)));
  }

  updateSmartCollection(id: string, data: Partial<CreateSmartCollectionDto>): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/smart-collections/${encodeURIComponent(id)}`, data)
      .pipe(catchError((e) => this.handleError(e)));
  }

  deleteSmartCollection(id: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/smart-collections/${encodeURIComponent(id)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  // =========================
  // BESTSELLERS
  // =========================

  /** Cached — requires fetching 250 orders + N product lookups on the backend. */
  getBestsellers(limit = 10, days = 30): Observable<any> {
    const key = `bestsellers:${limit}:${days}`;
    return this.cached(key, this.TTL.bestsellers, () =>
      this.http.get(`${this.baseUrl}/bestsellers`, {
        params: this.toHttpParams({ limit, days }),
      }),
    );
  }

  // =========================
  // SALE
  // =========================

  /** Cached — requires fetching 250 products on the backend. */
  getSaleProducts(limit = 4, minDiscount = 0, brand?: string): Observable<any> {
    const key = `sale:${limit}:${minDiscount}:${brand ?? ''}`;
    return this.cached(key, this.TTL.sale, () => {
      const params: any = { limit, minDiscount };
      if (brand) params.brand = String(brand).trim().toLowerCase();
      return this.http.get<any>(`${this.baseUrl}/sale`, { params });
    });
  }

  // =========================
  // FEATURED / RANDOM
  // =========================
  getRandomFeaturedProducts(
    collections: string[],
    pickCount: number = 4,
  ): Observable<ProductCard[]> {
    return this.http
      .post<any>(`${environment.apiUrl}/shopify/featured-products`, {
        collections,
        limitPerCollection: pickCount,
      })
      .pipe(
        map((res) => {
          const allProducts = Object.values(res ?? {}).flatMap(
            (section: any) => section?.products ?? [],
          );

          // Fisher–Yates shuffle
          for (let i = allProducts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
          }

          return allProducts.slice(0, pickCount).map(this.toProductCard);
        }),
      );
  }

  // =========================
  // VARIANTS
  // =========================
  getProductVariants(productId: string): Observable<ProductVariantsResponse> {
    return this.http
      .get<ProductVariantsResponse>(
        `${this.baseUrl}/products/${encodeURIComponent(productId)}/variants`,
      )
      .pipe(catchError((e) => this.handleError(e)));
  }

  getVariantById(variantId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/variants/${encodeURIComponent(variantId)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  resolveVariantId(productId: string, params: { option1?: string; title?: string }) {
    const qs = new URLSearchParams();
    if (params.option1) qs.set('option1', params.option1);
    if (params.title) qs.set('title', params.title);

    return this.http
      .get(`${this.baseUrl}/products/${encodeURIComponent(productId)}/variant-id?${qs.toString()}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  // -------------------------
  // Private helpers
  // -------------------------
  private toProductCard(p: any): ProductCard {
    const variants = Array.isArray(p?.variants) ? p.variants : [];

    const prices = variants
      .map((v: any) => Number(v?.price))
      .filter((n: number) => Number.isFinite(n) && n > 0);

    const comparePrices = variants
      .map((v: any) => Number(v?.compare_at_price))
      .filter((n: number) => Number.isFinite(n) && n > 0);

    const minPrice = prices.length ? Math.min(...prices) : null;
    const minCompare = comparePrices.length ? Math.min(...comparePrices) : null;
    const isOnSale = minPrice !== null && minCompare !== null && minCompare > minPrice;

    const fallbackRawPrice = p?.price ?? p?.variants?.[0]?.price ?? '';
    const fallbackPrice =
      fallbackRawPrice !== '' ? `$${String(fallbackRawPrice).replace(/^\$/, '')}` : '';

    const finalPrice = minPrice !== null ? `$${minPrice.toFixed(2)}` : fallbackPrice;

    return {
      id: String(p?.id ?? ''),
      name: String(p?.title ?? ''),
      brand: String(p?.vendor ?? ''),
      price: finalPrice,
      img: p?.image?.src || p?.images?.[0]?.src || 'assets/images/placeholder-product.png',
      handle: String(p?.handle ?? ''),
      salePrice: finalPrice,
      originalPrice: isOnSale && minCompare !== null ? `$${minCompare.toFixed(2)}` : '',
      isOnSale,
    } as any;
  }
}

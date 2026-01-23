import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

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
@Injectable({
  providedIn: 'root',
})
export class Shopify {
  private http = inject(HttpClient);

  /** Change this if your env uses a different key name */
  private baseUrl = `${environment.apiUrl}/shopify`;

  // -------------------------
  // Helpers
  // -------------------------
  private toHttpParams(obj?: Record<string, any>): HttpParams {
    let params = new HttpParams();
    if (!obj) return params;

    Object.entries(obj).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      // arrays => repeated query params: ?key=a&key=b
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
    // You can expand this to map backend error shapes to UI-friendly messages
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

  // Recommendations
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

  // Metafields
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
  getCollections(query?: CollectionQuery): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/collections`, { params: this.toHttpParams(query) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getCollectionById(id: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/collections/${encodeURIComponent(id)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  getCollectionProducts(id: string, limit = 50): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/collections/${encodeURIComponent(id)}/products`, {
        params: this.toHttpParams({ limit }),
      })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getCollectionByHandle(handle: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/collections/by-handle/${encodeURIComponent(handle)}`)
      .pipe(catchError((e) => this.handleError(e)));
  }

  /** POST /shopify/featured-products */
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
  getBestsellers(limit = 10, days = 30): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/bestsellers`, { params: this.toHttpParams({ limit, days }) })
      .pipe(catchError((e) => this.handleError(e)));
  }
}

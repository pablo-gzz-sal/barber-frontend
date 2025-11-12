import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeaturedProducts {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}${environment.shopifyEndpoint}`;

  /**
   * Get all featured sections for homepage
   */
  getFeaturedSections(): Observable<any> {
    return this.http.post(`${this.apiUrl}/featured-products`, {
      collections: ['joeys-faves', 'sale', 'bestsellers'],
      limitPerCollection: 4,
    });
  }

  /**
   * Get products from a specific collection by handle
   */
  getCollectionByHandle(handle: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/collections/by-handle/${handle}`);
  }

  /**
   * Get product recommendations
   */
  getProductRecommendations(productId: string, limit: number = 4): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${productId}/recommendations`, {
      params: { limit: limit.toString() },
    });
  }

  /**
   * Get bestsellers
   */
  getBestsellers(limit: number = 10, days: number = 30): Observable<any> {
    return this.http.get(`${this.apiUrl}/bestsellers`, {
      params: {
        limit: limit.toString(),
        days: days.toString(),
      },
    });
  }
}

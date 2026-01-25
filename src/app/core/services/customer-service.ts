import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
    private http = inject(HttpClient);

  me() {
    return this.http.get(`${environment.apiUrl}/customer/me`, {
      withCredentials: true,
    });
  }

    login() {
    window.location.href = `${environment.apiUrl}/customer-auth/login`;
  }

  logout() {
    window.location.href = `${environment.apiUrl}/customer-auth/logout`;
  }
}

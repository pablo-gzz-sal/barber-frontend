import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  constructor(private http: HttpClient) {}

  send(payload: ContactPayload) {
    return this.http.post<{ ok: boolean; messageId?: string }>(
      `${environment.apiUrl}/contact`,
      payload,
    );
  }
}

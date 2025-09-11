import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '@/libs/models/paginated-response.model';
import { Order } from '@/libs/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersApiService {

  private apiUrl = '/api/me/orders';

  constructor(private http: HttpClient) { }

  getOrders(
    status?: string,
    date_from?: string,
    date_to?: string,
    sort?: string,
    page: number = 1,
    lenPage: number = 15,
    type?: string
  ): Observable<PaginatedResponse<Order>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('lenPage', lenPage.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (date_from) {
      params = params.set('date_from', date_from);
    }
    if (date_to) {
      params = params.set('date_to', date_to);
    }
    if (sort) {
      params = params.set('sort', sort);
    }
    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<PaginatedResponse<Order>>(this.apiUrl, { params });
  }

  getOrderTypes(): Observable<{name: string, value: string}[]> {
    return this.http.get<{name: string, value: string}[]>('/api/orders/types');
  }
}

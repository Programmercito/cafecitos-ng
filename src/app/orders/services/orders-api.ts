import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '@/libs/models/paginated-response.model';
import { Order } from '@/libs/models/order.model';
import { WaitersCommissions } from '@/libs/models/waiters-commissions';

@Injectable({
  providedIn: 'root'
})
export class OrdersApiService {


  private apiUrl = '/api/me/orders';

  constructor(private http: HttpClient) { }

  getOrders(
    type?: string,
    date_from?: string,
    date_to?: string,
    sort?: string,
    page: number = 1,
    lenPage: number = 15
  ): Observable<PaginatedResponse<Order>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('lenPage', lenPage.toString());

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
      params = params.set('status', type);
    }

    return this.http.get<PaginatedResponse<Order>>(this.apiUrl, { params });
  }

  getOrderTypes(): Observable<{ name: string, value: string }[]> {
    return this.http.get<{ name: string, value: string }[]>('/api/orders/types');
  }

  // Creates a new order and returns it (expects backend to return created Order with id)
  createOrder(): Observable<Order> {
    return this.http.post<Order>('/api/orders', {});
  }

  closeOrder(orderId: number): Observable<Order> {
    return this.http.patch<Order>(`/api/orders/${orderId}/status/CLOSED`, {});
  }
  paidOrder(orderId: number): Observable<Order> {
    return this.http.patch<Order>(`/api/orders/${orderId}/status/PAID`, {});
  }
  voidedOrder(orderId: number): Observable<Order> {
    return this.http.patch<Order>(`/api/orders/${orderId}/status/VOIDED`, {});
  }
  moveToCommissiong(): Observable<any> {
    return this.http.put('/api/orders/move-to-commissiong', {});
  }
  moveToProcessed(): Observable<any> {
    return this.http.put('/api/orders/move-to-processed', {});
  }


  getCommissions(
    status?: string,
    date_from?: string,
    date_to?: string,
    sort?: string,
  ): Observable<WaitersCommissions[]> {
    let params = new HttpParams();

    if (date_from) {
      params = params.set('date_from', date_from);
    }
    if (date_to) {
      params = params.set('date_to', date_to);
    }
    if (sort) {
      params = params.set('sort', sort);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<WaitersCommissions[]>('/api/orders/waiter-commissions', { params });
  }
}

import { OrderDetail } from '@/libs/models/order.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class OrderDetailsApi {
  private http = inject(HttpClient);
  private readonly url = `/api/order-details`;

  getProductTypes(): Observable<{ name: string, value: string }[]> {
    return this.http.get<{ name: string, value: string }[]>(`${this.url}/types`);
  }

  getOrderDetails(orderId: number): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(this.url + "/" + orderId);
  }

  createDetail(detail: OrderDetail) {
    return this.http.post<OrderDetail>(this.url, detail);
  }

  updateDetail(id: number, detail:OrderDetail) {
    return this.http.put<OrderDetail>(`${this.url}/${id}`, detail);
  }

  deleteDetail(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}

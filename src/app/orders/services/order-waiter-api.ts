import { OrderWaiter } from '@/libs/models/order.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class OrderWaiterApi {
    private http = inject(HttpClient);
    private readonly url = '/api/order-waiters';

    getOrderWaiters(orderdetailid: number): Observable<OrderWaiter[]> {
        return this.http.get<OrderWaiter[]>(this.url + "/" + orderdetailid);
    }

    createWaiterDetail(detail: OrderWaiter) {
        return this.http.post<OrderWaiter>(this.url, detail);
    }

    updateWaiterDetail(id: number, detail: OrderWaiter) {
        return this.http.put<OrderWaiter>(`${this.url}/${id}`, detail);
    }

    deleteWaiterDetail(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

}

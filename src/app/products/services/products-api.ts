import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../../libs/models/Products-model';
import { PaginatedResponse } from '../../libs/models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {

  private apiUrl = '/api/products';

  constructor(private http: HttpClient) { }

  getProducts(
    active?: boolean,
    name?: string,
    page: number = 1,
    perPage: number = 15
  ): Observable<PaginatedResponse<Products>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    if (active !== undefined) {
      params = params.set('active', active.toString());
    }

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<PaginatedResponse<Products>>(this.apiUrl, { params });
  }
}

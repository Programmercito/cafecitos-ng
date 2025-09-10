import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsModel } from '../../libs/models/products-model';
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
  ): Observable<PaginatedResponse<ProductsModel>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    if (active !== undefined) {
      params = params.set('active', active ? "1" : "0");
    }

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<PaginatedResponse<ProductsModel>>(this.apiUrl, { params });
  }

  createProduct(product: Omit<ProductsModel, 'id' | 'is_active'>): Observable<ProductsModel> {
    return this.http.post<ProductsModel>(this.apiUrl, product);
  }

  updateProduct(id: number, product: ProductsModel): Observable<ProductsModel> {
    return this.http.put<ProductsModel>(`${this.apiUrl}/${id}`, product);
  }

  changeStatus(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { active });
  }

  uploadImage(id: number, image: File): Observable<void> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<void>(`${this.apiUrl}/${id}/image`, formData);
  }

  getProductTypes(): Observable<{name: string, value: string}[]> {
    return this.http.get<{name: string, value: string}[]>(`${this.apiUrl}/types`);
  }
}

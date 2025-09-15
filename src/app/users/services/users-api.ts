import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../../libs/models/user.model';
import { PaginatedResponse } from '../../libs/models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService { // Renamed from UsersApi to UsersApiService for consistency

  private apiUrl = '/api/users'; // Base URL for users API

  constructor(private http: HttpClient) { }

  getUsers(
    active?: boolean,
    name?: string, // Assuming 'name' can be used for filtering username/first_name/last_name
    page: number = 1,
    perPage: number = 15
  ): Observable<PaginatedResponse<UserModel>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    if (active !== undefined) {
      params = params.set('active', active ? "1" : "0");
    }

    if (name) {
      params = params.set('username', name);
    }

    return this.http.get<PaginatedResponse<UserModel>>(this.apiUrl, { params });
  }

  getUser(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Omit<UserModel, 'id' | 'is_active'>): Observable<UserModel> {
    return this.http.post<UserModel>(this.apiUrl, user);
  }

  updateUser(id: number, user: UserModel): Observable<UserModel> {
    const { id: userId, ...userData } = user; // Exclude id from body
    return this.http.put<UserModel>(`${this.apiUrl}/${id}`, userData);
  }

  changeStatus(id: number, is_active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { is_active });
  }

  getUsersType(): Observable<{ name: string, value: string }[]> {
    return this.http.get<{ name: string, value: string }[]>(`${this.apiUrl}/types`);
  }

  logout(): Observable<void> {
    return this.http.delete<void>('/api/auth/logout');
  }

  changePassword(current_password: string, new_password: string): Observable<void> {
    return this.http.post<void>('/api/auth/change-password', { current_password, new_password, new_password_confirmation: new_password });
  }

  getWaiters(username: string) {
    return this.http.get<UserModel[]>(`/api/users/waiters?username=${username}`);
  }
}
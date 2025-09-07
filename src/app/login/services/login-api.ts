import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCredentials } from '@/libs/models/UserCredentials';
import { Users } from '@/libs/models/Users';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8000/api/auth/login';

  constructor(private http: HttpClient) { }

  login(credentials: UserCredentials): Observable<Users> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.post<Users>(this.apiUrl, credentials, { headers });
  }
}
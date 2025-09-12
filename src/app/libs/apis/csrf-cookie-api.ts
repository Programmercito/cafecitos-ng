import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class CookieApiService {

    private apiUrl = '/sanctum/csrf-cookie';

    constructor(private http: HttpClient) { }

    csrf(): Observable<any> {
        return this.http.get(this.apiUrl, { observe: 'response', responseType: 'text' });
    }
}
// src/app/interceptors/auth-header.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersRequest implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const token = 'tu_token_aquí'; // Puedes inyectar un servicio para obtenerlo dinámicamente
    console.log('Interception in HeadersRequest');
    const modifiedReq = req.clone({
    
    });

    return next.handle(modifiedReq);
  }
}
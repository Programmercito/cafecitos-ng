import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieApiService } from '../apis/csrf-cookie-api';
import { switchMap } from 'rxjs/operators';

/**
 * Lee una cookie específica del navegador.
 * @param name El nombre de la cookie (ej. 'XSRF-TOKEN')
 * @returns El valor de la cookie o null si no se encuentra.
 */
function getCookie(name: string): string | null {
  const nameLenPlus = (name.length + 1);
  const cookieValue = document.cookie
    .split(';')
    .map(c => c.trim())
    .filter(cookie => cookie.substring(0, nameLenPlus) === `${name}=`)
    .map(cookie => decodeURIComponent(cookie.substring(nameLenPlus)))[0];
  return cookieValue || null;
}

export const headersRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfService = inject(CookieApiService);

  // Para peticiones que no modifican datos (GET, HEAD), no necesitamos el token.
  // Simplemente dejamos pasar la petición original.
  if (req.method === 'GET' || req.method === 'HEAD') {
    return next(req);
  }

  // Para POST, PUT, DELETE, etc., primero obtenemos el token CSRF.
  // csrfService.csrf() devuelve un Observable. Usamos .pipe() para encadenar operaciones.
  return csrfService.csrf().pipe(
    // switchMap "espera" a que csrfService.csrf() se complete.
    // Luego, toma la respuesta (que contiene el token) y la usa para
    // crear y devolver un nuevo Observable.
    switchMap(response => {
      // creo una variable y guardo ahi la cookie no el header COOOKIE
      const token = getCookie('XSRF-TOKEN');
      // decodifico el token
      const decodedToken = decodeURIComponent(token || '');
      // Clonamos la petición original y añadimos la cabecera con el token.
      const modifiedReq = req.clone({
        setHeaders: {
          'X-XSRF-TOKEN': decodedToken
        }
      });
      // Pasamos la petición modificada al siguiente interceptor o al backend.
      return next(modifiedReq);
    })
  );
};
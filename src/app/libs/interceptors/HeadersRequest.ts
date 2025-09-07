import { HttpInterceptorFn } from '@angular/common/http';

export const headersRequestInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interception in headersRequestInterceptor');
  
  const modifiedReq = req.clone({
    // Aquí puedes clonar y modificar la petición, por ejemplo, para añadir cabeceras
  });

  return next(modifiedReq);
};

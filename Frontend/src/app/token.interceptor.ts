import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | null = localStorage.getItem('token');
    const nombre: string | null = localStorage.getItem('nombre');
 //   const userId: number = localStorage.getItem('id');

    if (token !== null) {
      console.log('Token:', token);
    } else {
      console.log('No se encontró ningún token en el sessionStorage');
    }
    if (token) {
      // Clona la solicitud y agrega el encabezado de autorización
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      // Pasaa la solicitud clonada al siguiente manejador
      return next.handle(authReq);
    } else {
      // Si no hay token, continua con la solicitud original sin modificar
      return next.handle(req);
    }
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
interface UsuarioEmail {
  email: string;
  // otros campos si existen
}
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(private http: HttpClient) { }

  registro(registro: { email: string, password: string, telefono: number, role: string }): Observable<any> {
    return this.http.post<any>('http://localhost:3000/usuarios/register', registro);
  }

  registro2(registro: { email: string, password: string, telefono: number, role: string }): Observable<any> {
    return this.http.post<any>('http://localhost:3000/usuarios/register-admin', registro);
  }
  reset(registro: { email: string }): Observable<any> {
    return this.http.post<any>('http://localhost:3000/usuarios/forgot-password', registro);
  }

  cambioPassword(cambioPassword: { id: number, oldPassword: string, newPassword: string }): Observable<any> {
    return this.http.post<any>('http://localhost:3000/usuarios/change-password', cambioPassword);
  }

  obtenerProductos(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };

    return this.http.get<any>('http://localhost:3000/productos/', httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  obtenerUsuarios(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };

    return this.http.get<any>('http://localhost:3000/usuarios/users', httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  obtenerUsuarioPorId(): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    if (!token || !id) {
      return throwError('No hay token o ID almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };

    return this.http.get<any>(`http://localhost:3000/usuarios/${id}`, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  obtenerEmailUsuario(): Observable<string> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    if (!token || !id) {
      return throwError('No hay token o ID almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };
  
    return this.http.get<UsuarioEmail>(`http://localhost:3000/usuarios/${id}`, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        }),
        map(usuario => usuario.email) 
      );
  }
  
  obtenerUsuarioPorEmail(email: string): Observable<any> {

    return this.http.get<any>(`http://localhost:3000/usuarios/email/${email}`)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }
  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`http://localhost:3000/usuarios/actualizar/${id}`, usuario, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  activar(id: { id: number }): Observable<any> {
    return this.http.post<any>('http://localhost:3000/usuarios/enable-user', id);
  }

  desactivar(id: { id: number }): Observable<any> {
    return this.http.post<any>('http://localhost:3000/usuarios/disable-user', id);
  }

  obtenerUsuarioPorId2(id: number): Observable<any> {
    const token = localStorage.getItem('token');
   

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };

    return this.http.get<any>(`http://localhost:3000/usuarios/${id}`, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  enviarEmailConPedidos(idOrden: number, email: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };


    return this.http.get<any>(`http://localhost:3000/pedidos/enviar-email/${idOrden}/${email}`,httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  enviarEmailPedidoPronto(id: number, email: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };
  
    return this.http.get<any>(`http://localhost:3000/ordenesCompra/enviar-correo-estado/${id}/${email}`, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }
  
}

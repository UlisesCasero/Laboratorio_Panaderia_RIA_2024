import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Pedido } from 'src/models/pedido';
import { PedidoOrden } from 'src/models/pedidoOrden';
import { PedidoVista } from 'src/models/pedidoVistaPanadero';
import { InsumoPedido } from 'src/models/insumoPedido';
import { InsumoFiltro } from 'src/models/insumoTotalesFiltro';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/pedidos/';

  constructor(private http: HttpClient) {}

  postPedido(pedido: Pedido) {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    console.log('LLEGA A PEDIDO SERVICE');

    return this.http.post<Pedido>(this.apiUrl, pedido, httpOptions).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getPedidoById(id: number): Observable<Pedido> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    const url = `http://localhost:3000/pedidos/${id}`;
    return this.http.get<Pedido>(url, httpOptions).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getPedidosByOrdenId(id: number): Observable<PedidoOrden[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    const url = `http://localhost:3000/pedidos/orden/${id}`;
    return this.http.get<PedidoOrden[]>(url, httpOptions).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getPedidosPanaderoByOrdenId(id: number): Observable<PedidoVista[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    const url = `http://localhost:3000/pedidos/pedidos-panadero-orden/${id}`;
    return this.http.get<PedidoVista[]>(url, httpOptions).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getInsumosByPedidoId(id: number): Observable<InsumoPedido[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    const url = `http://localhost:3000/pedidos/insumos-pedido/${id}`;
    return this.http.get<InsumoPedido[]>(url, httpOptions).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getInsumosTotalesPanadero(): Observable<InsumoFiltro[]> {
    const id = parseInt(localStorage.getItem('userId')!);
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    const url = `http://localhost:3000/ordenesCompra/filtro-insumos-panadero/${id}`;
    return this.http.get<InsumoFiltro[]>(url, httpOptions).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getInsumosTotalesAdmin(): Observable<InsumoFiltro[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    const url = `http://localhost:3000/ordenesCompra/filtro-insumos-admin/`;
    return this.http.get<InsumoFiltro[]>(url, httpOptions).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  actualizarPedidoEstado(id: number): Observable<Pedido> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    const url = `http://localhost:3000/pedidos/actualizar-estado/${id}`;
    return this.http.put<Pedido>(url, httpOptions).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}

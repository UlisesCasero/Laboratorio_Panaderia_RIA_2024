import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, lastValueFrom, throwError } from 'rxjs';
import { Producto } from 'src/models/producto';
import { OrdenCompra } from 'src/models/ordenCompra';
import { OrdenVista } from 'src/models/ordenVistaPanadero';
import { InsumoFiltro, InsumoTotal } from 'src/models/insumoTotalesFiltro';
import { PedidoService } from './pedido.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {
  private apiUrl = 'http://localhost:3000/ordenesCompra/';

  constructor(private http: HttpClient, private pedidosSvc: PedidoService) { }

  getOrdenesCompra(): Observable<OrdenCompra[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer '+ token
      })
    };

    return this.http.get<OrdenCompra[]>(this.apiUrl, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getOrdenCompraById(ordenCompraId: number): Observable<OrdenCompra> {
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

    const url = `http://localhost:3000/ordenesCompra/${ordenCompraId}`;
    return this.http.get<any>(url, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getOrdenCompraByCienteId(id: number): Observable<OrdenCompra[]> {
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

    const url = `http://localhost:3000/ordenesCompra/user/${id}`;
    return this.http.get<OrdenCompra[]>(url, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getOrdenCompraByPanaderoId(): Observable<OrdenVista[]> {
    const id = Number(localStorage.getItem('userId'));

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

    const url = `http://localhost:3000/ordenesCompra/panadero/${id}`;
    return this.http.get<OrdenVista[]>(url, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getOrdenCompraSinAsignar(): Observable<OrdenVista[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer '+ token
      })
    };

    const url = `http://localhost:3000/ordenesCompra/ordenes-sin-asignacion`;
    return this.http.get<OrdenVista[]>(url, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  postOrdenCompra(orden: OrdenCompra): Observable<OrdenCompra> {
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

    return this.http.post<OrdenCompra>(this.apiUrl, orden, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  //Insumos total
  //Insumos
  private listaTotalInsumosAdmin: InsumoFiltro[] = [];

  //Observable
  private totalInsumosAdmin = new BehaviorSubject<InsumoFiltro[]>([]);
  totalInsumosAdmin$ = this.totalInsumosAdmin.asObservable();

  //Obtener insumos de pedido
  async obtenerTotalInsumosAdmin() {
    try {
      const totalInsumos = await lastValueFrom(
        this.pedidosSvc.getInsumosTotalesAdmin()
      );
      console.log('Insumos: ', totalInsumos);
      this.listaTotalInsumosAdmin = totalInsumos;
      this.totalInsumosAdmin.next(this.listaTotalInsumosAdmin);
    } catch (error) {
      console.error('Error al obtener insumos para el pedido:', error);
    }
  }

  filtrarInsumosPorFechaYEstadoAdmin(fechaInicio: string, fechaFin: string, estado: string): InsumoTotal[] {
    let insumosFiltrados: InsumoTotal[] = [];

    this.listaTotalInsumosAdmin.forEach(orden => {
      if ((fechaInicio === '' || orden.fecha_entrega >= fechaInicio) &&
          (fechaFin === '' || orden.fecha_entrega <= fechaFin) &&
          (estado === '' || orden.estadoOrden === estado)) {
        
        orden.insumos.forEach(insumo => {
          const existeInsumo = insumosFiltrados.find(i => i.insumoNombre === insumo.insumoNombre);
          if (existeInsumo) {
            existeInsumo.totalInsumo += insumo.totalInsumo;
          } else {
            insumosFiltrados.push({
              insumoNombre: insumo.insumoNombre,
              totalInsumo: insumo.totalInsumo
            });
          }
        });
      }
    });

    return insumosFiltrados;
  }

  confirmarEntrega(id: number){
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

    const url = `http://localhost:3000/ordenesCompra/ordenEntregada/${id}`;
    return this.http.put<any>(url, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }
}

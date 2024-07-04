import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, lastValueFrom, tap, throwError } from 'rxjs';;
import { OrdenVista } from 'src/models/ordenVistaPanadero';
import { InsumoFiltro, InsumoTotal } from 'src/models/insumoTotalesFiltro';
import { PedidoService } from './pedido.service';
import { PedidoVista } from 'src/models/pedidoVistaPanadero';

@Injectable({
  providedIn: 'root'
})
export class OrdenesAdminService {

  constructor(private http: HttpClient, private pedidosSvc: PedidoService) { }

  //Ordenes de compra Admin
  getOrdenCompraAdmin(): Observable<OrdenVista[]> {
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
    const url = 'http://localhost:3000/ordenesCompra/ordenes-admin/';
    return this.http.get<OrdenVista[]>(url, httpOptions)
      .pipe(
        tap(response => {
          console.log('Respuesta');
          console.log('Respuesta del servidor:', response);
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  //Ordenes Compra
  private listaOrdenesAdmin: OrdenVista[] = [];

  //Observable
  private ordenesAdmin = new BehaviorSubject<OrdenVista[]>([]);
  ordenesAdmin$ = this.ordenesAdmin.asObservable();

  //Obtener Ordenes de compra
  async obtenerOrdenesAdmin() {
    try {
      const ordenes = await lastValueFrom(
        this.getOrdenCompraAdmin()
      );
      this.listaOrdenesAdmin = ordenes;
      this.ordenesAdmin.next(this.listaOrdenesAdmin);
    } catch (error) {
      console.error('Error al obtener insumos para el pedido:', error);
    }
  }

  /*filtrarInsumosPorFechaYEstadoAdmin(fechaInicio: string, fechaFin: string, estado: string): InsumoTotal[] {
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
  }*/

//Pedidos
private listaPedidosAdmin: PedidoVista[] = [];

//Observable
private pedidosOrdenAdmin = new BehaviorSubject<PedidoVista[]>([]);
pedidosOrdenAdmin$ = this.pedidosOrdenAdmin.asObservable();

//Obtener pedidos de orden
async obtenerpedidosOrden(idOrden: number) {
  try {
    const pedidos = await lastValueFrom(
      this.pedidosSvc.getPedidosPanaderoByOrdenId(idOrden)
    );
    console.log('Pedidos: ', pedidos);
    this.listaPedidosAdmin = pedidos;
    this.pedidosOrdenAdmin.next(this.listaPedidosAdmin);
  } catch (error) {
    console.error('Error al obtener órdenes para panadero:', error);
  }
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
}

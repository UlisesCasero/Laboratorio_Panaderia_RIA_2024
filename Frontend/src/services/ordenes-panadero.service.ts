import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  lastValueFrom,
  throwError,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrdenVista } from 'src/models/ordenVistaPanadero';
import { OrdenCompraService } from './orden-compra.service';
import { PedidoService } from './pedido.service';
import { PedidoVista } from 'src/models/pedidoVistaPanadero';
import { InsumoPedido } from 'src/models/insumoPedido';
import { InsumoFiltro, InsumoTotal } from 'src/models/insumoTotalesFiltro';

@Injectable({
  providedIn: 'root',
})
export class OrdenesPanaderoService {
  private apiUrl = 'http://localhost:3000/ordenesCompra/';

  constructor(
    private httpCliente: HttpClient,
    private ordenesSvc: OrdenCompraService,
    private pedidosSvc: PedidoService
  ) {}

  //Ordenes
  //Lista que se emitira y escuchara
  private miListaOrdenes: OrdenVista[] = [];
  
  //Observable
  private misOrdens = new BehaviorSubject<OrdenVista[]>([]);
  misOrdenes$ = this.misOrdens.asObservable();

  //Obtener ordenes panadero
  async obtenerOrdenesPanadero() {
    try {
      const ordenes = await lastValueFrom(
        this.ordenesSvc.getOrdenCompraByPanaderoId()
      );
      console.log('ORDENES: ', ordenes);
      this.miListaOrdenes = ordenes;
      this.misOrdens.next(this.miListaOrdenes);
    } catch (error) {
      console.error('Error al obtener órdenes para panadero:', error);
    }
  }

// Ordenes sin asignar 
  private listaSinAsignar: OrdenVista[] = [];
  
  private ordenSinAsignar = new BehaviorSubject<OrdenVista[]>([]);
  ordenSinAsignar$ = this.ordenSinAsignar.asObservable();

  async obtenerOrdenesSinAsignar() {
    try {
      const ordenes = await lastValueFrom(
        this.ordenesSvc.getOrdenCompraSinAsignar()
      );
      this.listaSinAsignar = ordenes;
      this.ordenSinAsignar.next(this.listaSinAsignar);
    } catch (error) {
      console.error('Error al obtener órdenes sin asignar:', error);
    }
  }

  //funcion asiganrorden
  asignarPanadero(idPanadero: number, idOrden: number): Observable<any> {
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

    const url = `${this.apiUrl}asignar-panadero/${idPanadero}/${idOrden}`;
    return this.httpCliente.put(url, {}, httpOptions).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  async actualizarListaSinASignar() {
    try {
      const ordenes = await lastValueFrom(
        this.ordenesSvc.getOrdenCompraSinAsignar()
      );
      this.listaSinAsignar = ordenes;
      this.ordenSinAsignar.next(this.listaSinAsignar);
    } catch (error) {
      console.error('Error al actualizar la lista de órdenes sin asignar:', error);
    }
  }
  

  //cambiar estado orden

  //finalizar orden

  //....

  //Pedidos
  private listaPedidosOrden: PedidoVista[] = [];

  //Observable
  private pedidosOrden = new BehaviorSubject<PedidoVista[]>([]);
  pedidosOrden$ = this.pedidosOrden.asObservable();

  //Obtener pedidos de orden
  async obtenerpedidosOrden(idOrden: number) {
    try {
      const pedidos = await lastValueFrom(
        this.pedidosSvc.getPedidosPanaderoByOrdenId(idOrden)
      );
      console.log('Pedidos: ', pedidos);
      this.listaPedidosOrden = pedidos;
      this.pedidosOrden.next(this.listaPedidosOrden);
    } catch (error) {
      console.error('Error al obtener órdenes para panadero:', error);
    }
  }

  //Insumos
  private listaInsumosPedido: InsumoPedido[] = [];

  //Observable
  private insumosPedido = new BehaviorSubject<InsumoPedido[]>([]);
  insumosPedido$ = this.insumosPedido.asObservable();

  //Obtener insumos de pedido
  async obtenerInsumosPedido(idPedido: number) {
    try {
      console.log('Llega a aca');
      const insumos = await lastValueFrom(
        this.pedidosSvc.getInsumosByPedidoId(idPedido)
      );
      console.log('Insumos: ',insumos);
      this.listaInsumosPedido = insumos;
      this.insumosPedido.next(this.listaInsumosPedido);
    } catch (error) {
      console.error('Error al obtener insumos para el pedido:', error);
    }
  }

  //Actualizar estado orden
  actualizarEstadoOrden(id: number): Observable<any> {
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

    const url = `http://localhost:3000/ordenesCompra/actualizar-estado/${id}`;
    return this.httpCliente.put<any>(url, httpOptions).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  //Insumos total
  //Insumos
  private listaTotalInsumos: InsumoFiltro[] = [];

  //Observable
  private totalInsumos = new BehaviorSubject<InsumoFiltro[]>([]);
  totalInsumos$ = this.totalInsumos.asObservable();

  //Obtener insumos de pedido
  async obtenerTotalInsumos() {
    try {
      const totalInsumos = await lastValueFrom(
        this.pedidosSvc.getInsumosTotalesPanadero()
      );
      console.log('Insumos: ', totalInsumos);
      this.listaTotalInsumos = totalInsumos;
      this.totalInsumos.next(this.listaTotalInsumos);
    } catch (error) {
      console.error('Error al obtener insumos para el pedido:', error);
    }
  }

  /*filtrarInsumosPorFecha(fechaInicio: string, fechaFin: string): InsumoTotal[] {
    const insumosConsolidados: { [key: string]: number } = {};

    // Filtrar los insumos por fecha
    const insumosFiltrados = this.listaTotalInsumos.filter(insumoFiltro => {
      return insumoFiltro.fecha_entrega >= fechaInicio && insumoFiltro.fecha_entrega <= fechaFin;
    });

    // Consolidar las cantidades de los insumos
    insumosFiltrados.forEach(insumoFiltro => {
      insumoFiltro.insumos.forEach(insumo => {
        if (insumosConsolidados[insumo.insumoNombre]) {
          insumosConsolidados[insumo.insumoNombre] += insumo.totalInsumo;
        } else {
          insumosConsolidados[insumo.insumoNombre] = insumo.totalInsumo;
        }
      });
    });

    // Convertir el objeto consolidado a un array de InsumoTotal
    return Object.keys(insumosConsolidados).map(nombre => {
      return new InsumoTotal(nombre, insumosConsolidados[nombre]);
    });
  }*/

  filtrarInsumosPorFechaYEstado(fechaInicio: string, fechaFin: string, estado: string): InsumoTotal[] {
    let insumosFiltrados: InsumoTotal[] = [];

    this.listaTotalInsumos.forEach(orden => {
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

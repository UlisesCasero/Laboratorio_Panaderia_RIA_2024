import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdenVista } from 'src/models/ordenVistaPanadero';
import { OrdenCompraService } from 'src/services/orden-compra.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';
import { Router } from '@angular/router';
import { PedidoService } from 'src/services/pedido.service';
import { estadoPedido } from 'src/enums/estado-pedido';
import { ModalOrdenesDetallesComponent } from '../modal-ordenes-detalles/modal-ordenes-detalles.component';
import { ModalDetalleInsumosTotalesComponent } from '../modal-detalle-insumos-totales/modal-detalle-insumos-totales.component';

@Component({
  selector: 'app-home-panadero',
  templateUrl: './home-panadero.component.html',
  styleUrls: ['./home-panadero.component.scss'],
})
export class HomePanaderoComponent implements OnInit {
  misOrdenes$: Observable<OrdenVista[]>;
  pageSize = 5;
  currentPage = 1;
  ordenesAsignadas: OrdenVista[] = [];
  ordenes: OrdenVista[] = [];
  constructor(
    private router: Router,
    private ordenesSvc: OrdenCompraService,
    private ordenesPanaderoSvc: OrdenesPanaderoService,
    private pedidoSvc: PedidoService
  ) {
    this.misOrdenes$ = this.ordenesPanaderoSvc.misOrdenes$;
  }

  ngOnInit(): void {
    this.ordenesPanaderoSvc.obtenerOrdenesPanadero();
    this.misOrdenes$.subscribe((data) => {
      this.ordenes = data;
      this.filteredOrdenes = this.ordenes;
    });
  }
  @ViewChild(ModalOrdenesDetallesComponent)
  crearProductoModal!: ModalOrdenesDetallesComponent;

  openModalCreacion(idOrden: number) {
    if (this.crearProductoModal) {
      this.crearProductoModal.open(idOrden);
      this.crearProductoModal.ordenesActualizadas.subscribe(() => {
        this.actualizarTabla();
        this.applyEstadoFilter();
      });
    } else {
      console.error('El modal aún no está disponible.');
    }
  }

  filteredOrdenes: OrdenVista[] = [];
  selectedEstado: string = 'Todos';
  estados: string[] = ['Listo para recoger', 'Pendiente', 'En preparación'];

  applyEstadoFilter() {
    this.selectedEstado === 'Todos';
    if (this.selectedEstado === 'Todos') {
      this.filteredOrdenes = this.ordenes;
    } else {
      this.filteredOrdenes = this.ordenes.filter(
        (orden) => orden.estadoOrden === this.selectedEstado
      );
    }
    this.currentPage = 1;
  }

  actualizarTabla() {
    this.ordenesPanaderoSvc.obtenerOrdenesPanadero();
  }

  verDetalle(idOrden: number, origen: string) {
    this.router.navigate(['/pedidos-orden', idOrden], {
      queryParams: { origen: origen },
    });
  }

  insumosTotales() {
    this.router.navigate(['/totalFiltro']);
  }

  @ViewChild(ModalDetalleInsumosTotalesComponent)
  crearProductoModal2!: ModalDetalleInsumosTotalesComponent;

  openModalCreacion2() {
    if (this.crearProductoModal2) {
      this.crearProductoModal2.open();
      this.crearProductoModal2.ordenesActualizadas2.subscribe(() => {
        // this.actualizarTabla();
      });
    } else {
      console.error('El modal aún no está disponible.');
    }
  }

  isPanadero(): boolean {
    const role = localStorage.getItem('rol');
    return role === 'PANADERO';
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(
      this.startIndex + this.pageSize - 1,
      this.ordenes.length - 1
    );
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrdenes.length / this.pageSize);
  }

  get paginatedOrdenes(): OrdenVista[] {
    return this.filteredOrdenes.slice(this.startIndex, this.endIndex + 1);
  }
}

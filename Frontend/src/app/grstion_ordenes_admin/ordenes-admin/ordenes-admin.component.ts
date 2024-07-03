import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdenVista } from 'src/models/ordenVistaPanadero';
import { OrdenCompraService } from 'src/services/orden-compra.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';
import { Router } from '@angular/router';
import { PedidoService } from 'src/services/pedido.service';
import { estadoPedido } from 'src/enums/estado-pedido';
import { OrdenesAdminService } from 'src/services/ordenes-admin.service';
import { ModalOrdenesDetallesComponent } from 'src/app/gestion_de_panadero/modal-ordenes-detalles/modal-ordenes-detalles.component';
import { PedidosAdminModalComponent } from '../pedidos-admin-modal/pedidos-admin-modal.component';
import { ModalDetalleInsumosTotalesComponent } from 'src/app/gestion_de_panadero/modal-detalle-insumos-totales/modal-detalle-insumos-totales.component';
import { ModalInsumosTotalesComponent } from '../modal-insumos-totales/modal-insumos-totales.component';

@Component({
  selector: 'app-ordenes-admin',
  templateUrl: './ordenes-admin.component.html',
  styleUrls: ['./ordenes-admin.component.scss'],
})
export class OrdenesAdminComponent implements OnInit{
  ordenesAdmin$: Observable<OrdenVista[]>;
  pageSize = 2;
  currentPage = 1;
  ordenesAsignadas: OrdenVista[] = [];
  ordenes: OrdenVista[] = [];
  ordenAscendente: boolean = true;
  filteredOrdenes: OrdenVista[] = [];
  selectedEstado: string = 'Todos';
  estados: string[] = ['Listo para recoger', 'Pendiente', 'En preparación'];

  constructor(
    private router: Router,
    private ordenesAdminSvc: OrdenesAdminService,
    private ordenesPanaderoSvc: OrdenesPanaderoService,
    private pedidoSvc: PedidoService
  ) {
    this.ordenesAdmin$ = this.ordenesAdminSvc.ordenesAdmin$;
  }

  ngOnInit(): void {
    this.ordenesAdminSvc.obtenerOrdenesAdmin();
    this.ordenesAdmin$.subscribe((data) => {
      this.ordenes = data;
      this.filteredOrdenes = this.ordenes;
    });
  }
  @ViewChild(PedidosAdminModalComponent)
  verDetalleModal!: PedidosAdminModalComponent;

  openModalPedidos(idOrden: number) {
    if (this.verDetalleModal) {
      this.verDetalleModal.open(idOrden);
      this.verDetalleModal.ordenesActualizadas.subscribe(() => {
        this.actualizarTabla();
        this.applyEstadoFilter();
      });
    } else {
      console.error('El modal aún no está disponible.');
    }
  }

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

  ordenarPorFecha() {
    if (this.ordenes) {
      this.filteredOrdenes.sort((a, b) => {
        if (this.ordenAscendente) {
          return new Date(a.fecha_entrega).getTime() - new Date(b.fecha_entrega).getTime();
        } else {
          return new Date(b.fecha_entrega).getTime() - new Date(a.fecha_entrega).getTime();
        }
      });
      this.ordenAscendente = !this.ordenAscendente;
    }
  }

  actualizarTabla() {
    this.ordenesAdminSvc.getOrdenCompraAdmin();
  }

  verDetalle(idOrden: number, origen: string) {
    this.router.navigate(['/pedidos-orden', idOrden], {
      queryParams: { origen: origen },
    });
  }

  insumosTotales() {
    this.router.navigate(['/total-insumo-admin']);
  }
  @ViewChild(ModalInsumosTotalesComponent) crearProductoModal2!: ModalInsumosTotalesComponent;

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
  isAdmin(): boolean {
    const role = localStorage.getItem('rol');
    return role === 'ADMIN';
  }


  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize - 1, this.ordenes.length - 1);
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

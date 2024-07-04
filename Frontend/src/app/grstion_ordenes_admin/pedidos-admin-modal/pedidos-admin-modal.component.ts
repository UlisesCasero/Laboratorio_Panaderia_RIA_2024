import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { OrdenCompraService } from 'src/services/orden-compra.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';
import { PedidoVista } from 'src/models/pedidoVistaPanadero';
import { PedidoService } from 'src/services/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesAdminService } from 'src/services/ordenes-admin.service';
import { ModalDetalleInsumosComponent } from 'src/app/gestion_de_panadero/modal-detalle-insumos/modal-detalle-insumos.component';

@Component({
  selector: 'app-pedidos-admin-modal',
  templateUrl: './pedidos-admin-modal.component.html',
  styleUrls: ['./pedidos-admin-modal.component.scss'],
})
export class PedidosAdminModalComponent {
  @Output() ordenesActualizadas: EventEmitter<void> = new EventEmitter<void>();
  pedidosOrden$: Observable<PedidoVista[]>;

  isVisible = false;
  idOrden!: number;
  ordenEstado = false;
  ordenEstadoListo = '';

  mostrar: boolean = false;
  mostrar2: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesAdminSvc: OrdenesAdminService,
    private pedidoSvc: PedidoService
  ) {
    this.pedidosOrden$ = this.ordenesAdminSvc.pedidosOrdenAdmin$;
  }

  ngOnInit(): void {
    this.obtenerPedidosOrden();
    this.pedidosOrden$.subscribe((data) => {});
    //this.obtenerPedidosOrden(1);
  }

  async obtenerPedidosOrden(): Promise<void> {
    try {
      const data = await this.ordenesAdminSvc.obtenerpedidosOrden(this.idOrden);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  }

  cerrarModal() {
    this.mostrar = false;
    this.ordenesActualizadas.emit();
  }

  verDetalle(idPedido: number) {
    this.router.navigate(['/insumos-pedido', idPedido]);
  }

  @ViewChild(ModalDetalleInsumosComponent)
  crearProductoModal2!: ModalDetalleInsumosComponent;

  openModalCreacion(idOrden: number) {
    if (this.crearProductoModal2) {
      this.crearProductoModal2.open(idOrden);
      this.crearProductoModal2.ordenesActualizadas2.subscribe(() => {
        // this.actualizarTabla();
      });
    } else {
      console.error('El modal aún no está disponible.');
    }
  }

  open(idOrden: number): void {
    this.mostrar = true;
    this.idOrden = idOrden; // Actualiza el id de la orden al abrir el modal
    this.obtenerPedidosOrden(); // Vuelve a obtener los pedidos al abrir el modal
  }

  close() {
    this.mostrar = false;
    this.ordenesActualizadas.emit(); // Emitir evento de actualización al cerrar el modal
  }

  mostrarMensajeExito2(): void {
    this.ordenEstado = true;
    setTimeout(() => {
      this.ordenEstado = false;
    }, 3000);
  }

  mostrarMensajeError2(mensaje: string): void {
    this.ordenEstadoListo = mensaje;
    setTimeout(() => {
      this.ordenEstadoListo = '';
    }, 5000);
  }
}

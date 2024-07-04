import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PedidoVista } from 'src/models/pedidoVistaPanadero';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';
import { PedidoService } from 'src/services/pedido.service';
import { ModalDetalleInsumosComponent } from '../modal-detalle-insumos/modal-detalle-insumos.component';

@Component({
  selector: 'app-modal-detalle-orden',
  templateUrl: './modal-detalle-orden.component.html',
  styleUrls: ['./modal-detalle-orden.component.scss'],
})
export class ModalDetalleOrdenComponent {
  @Output() ordenesActualizadas: EventEmitter<void> = new EventEmitter<void>();
  pedidosOrden$: Observable<PedidoVista[]>;
  isVisible = false;
  idOrden!: number;
  ordenEstado = false;
  ordenEstadoListo = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesPanaderoSvc: OrdenesPanaderoService,
    private pedidoSvc: PedidoService
  ) {
    this.pedidosOrden$ = this.ordenesPanaderoSvc.pedidosOrden$;
  }

  ngOnInit(): void {
    this.obtenerPedidosOrden();
    this.pedidosOrden$.subscribe((data) => {});
  }

  async obtenerPedidosOrden(): Promise<void> {
    try {
      const data = await this.ordenesPanaderoSvc.obtenerpedidosOrden(
        this.idOrden
      );
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  }

  actualizarEstado(idPedido: number) {
    this.pedidoSvc.getPedidoById(idPedido).subscribe({
      next: (data) => {
        this.pedidoSvc.actualizarPedidoEstado(data.id).subscribe({
          next: () => {
            this.ordenesPanaderoSvc
              .actualizarEstadoOrden(this.idOrden)
              .subscribe({
                next: (response) => {
                  this.obtenerPedidosOrden();
                  this.mostrarMensajeExito2();
                },
                error: (error) => {
                  console.error(
                    'Error al actualizar el estado de la orden:',
                    error
                  );
                },
              });
          },
          error: (error) => {
            console.error('Error al actualizar el estado del pedido:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error al obtener el pedido:', error);
      },
    });
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

  openModalCreacion2(idOrden: number) {
    if (this.crearProductoModal2) {
      this.crearProductoModal2.open(idOrden);
      this.crearProductoModal2.ordenesActualizadas2.subscribe(() => {
        // this.actualizarTabla();
      });
    } else {
      console.error('El modal aún no está disponible.');
    }
  }

  mostrar: boolean = false;

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

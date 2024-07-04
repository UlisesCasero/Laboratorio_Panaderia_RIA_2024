import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PedidoVista } from 'src/models/pedidoVistaPanadero';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';
import { PedidoService } from 'src/services/pedido.service';
import { ModalDetalleInsumosComponent } from '../modal-detalle-insumos/modal-detalle-insumos.component';
import { ServiciosService } from 'src/services/servicios.service';

@Component({
  selector: 'app-modal-ordenes-detalles',
  templateUrl: './modal-ordenes-detalles.component.html',
  styleUrls: ['./modal-ordenes-detalles.component.scss'],
})
export class ModalOrdenesDetallesComponent implements OnInit {
  @Output() ordenesActualizadas: EventEmitter<void> = new EventEmitter<void>();
  pedidosOrden$: Observable<PedidoVista[]>;
  isVisible = false;
  idOrden!: number;
  ordenEstado = false;
  ordenEstadoListo = '';
  email!: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesPanaderoSvc: OrdenesPanaderoService,
    private pedidoSvc: PedidoService,
    private service: ServiciosService
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

                  if (response.estado === 'Listo para recoger') {
                    this.service
                      .obtenerUsuarioPorId2(response.idCliente)
                      .subscribe(
                        (usuario) => {
                          this.email = usuario.email;

                          this.service
                            .enviarEmailPedidoPronto(this.idOrden, this.email)
                            .subscribe(
                              () => {},
                              (error) => {
                                console.error(
                                  'Error al enviar el correo:',
                                  error
                                );
                              }
                            );
                        },
                        (error) => {
                          console.error('Error al obtener el usuario:', error);
                        }
                      );
                  }
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

  mostrar: boolean = false;
  mostrar2: boolean = false;
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

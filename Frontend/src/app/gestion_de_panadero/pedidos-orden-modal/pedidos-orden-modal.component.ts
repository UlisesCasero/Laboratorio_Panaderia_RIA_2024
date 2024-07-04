import { Component, OnInit } from '@angular/core';
import { OrdenCompraService } from 'src/services/orden-compra.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';
import { PedidoVista } from 'src/models/pedidoVistaPanadero';
import { PedidoService } from 'src/services/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pedidos-orden-modal',
  templateUrl: './pedidos-orden-modal.component.html',
  styleUrls: ['./pedidos-orden-modal.component.scss'],
})
export class PedidosOrdenModalComponent implements OnInit {
  pedidosOrden$: Observable<PedidoVista[]>;

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
    //this.obtenerPedidosOrden(1);
  }

  async obtenerPedidosOrden(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      const id = +params['id'];
      try {
        const data = await this.ordenesPanaderoSvc.obtenerpedidosOrden(id);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    });
  }

  actualizarEstado(idPedido: number) {
    this.pedidoSvc.getPedidoById(idPedido).subscribe({
      next: (data) => {
        this.pedidoSvc.actualizarPedidoEstado(data.id).subscribe({
          next: () => {
            this.route.params.subscribe((params) => {
              const id = +params['id'];
              this.ordenesPanaderoSvc.actualizarEstadoOrden(id).subscribe({
                next: (response) => {
                  this.obtenerPedidosOrden();
                },
                error: (error) => {
                  console.error(
                    'Error al actualizar el estado de la orden:',
                    error
                  );
                },
              });
            });
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  cerrarModal() {
    this.router.navigate(['/home']);
  }

  verDetalle(idPedido: number) {
    this.router.navigate(['/insumos-pedido', idPedido]);
  }

  isPanadero(): boolean {
    const role = localStorage.getItem('rol');
    return role === 'PANADERO';
  }
}

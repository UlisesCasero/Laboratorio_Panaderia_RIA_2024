import { Component, OnInit } from '@angular/core';
import { InsumoPedido } from 'src/models/insumoPedido';
import { Observable } from 'rxjs';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';
import { PedidoService } from 'src/services/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-insumos-pedido-modal',
  templateUrl: './insumos-pedido-modal.component.html',
  styleUrls: ['./insumos-pedido-modal.component.scss'],
})
export class InsumosPedidoModalComponent implements OnInit {
  insumosPedido$: Observable<InsumoPedido[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesPanaderoSvc: OrdenesPanaderoService
  ) {
    this.insumosPedido$ = this.ordenesPanaderoSvc.insumosPedido$;
  }

  ngOnInit(): void {
    this.obtenerInsumosPedidos();
    this.insumosPedido$.subscribe((data) => {});
  }

  async obtenerInsumosPedidos(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      const id = +params['id'];
      try {
        const data = await this.ordenesPanaderoSvc.obtenerInsumosPedido(id);
      } catch (error) {
        console.error('Error al obtener insumos:', error);
      }
    });
  }

  cerrarModal() {
    this.route.params.subscribe(async (params) => {
      const id = +params['id'];
      this.router.navigate(['/pedidos-orden', id]);
    });
  }
}

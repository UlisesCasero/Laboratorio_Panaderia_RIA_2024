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
    this.insumosPedido$.subscribe((data) => {
      console.log('Insumos pedido: ', data);
    });
  }

  async obtenerInsumosPedidos(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      const id = +params['id'];
      console.log('ID: ', id);
      try {
        const data = await this.ordenesPanaderoSvc.obtenerInsumosPedido(id);
        console.log('Insumos obtenidos: ', data);
      } catch (error) {
        console.error('Error al obtener insumos:', error);
      }
    });
  }

  cerrarModal() {
    this.route.params.subscribe(async (params) => {
      const id = +params['id'];
      console.log('ID: ', id);
      this.router.navigate(['/pedidos-orden', id]);
    });
    
  }
}

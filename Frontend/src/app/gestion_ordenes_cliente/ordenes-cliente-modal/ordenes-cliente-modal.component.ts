import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidoOrden } from 'src/models/pedidoOrden';
import { PedidoService } from 'src/services/pedido.service';
import { Router } from '@angular/router';
import { estadoPedido } from 'src/enums/estado-pedido';

@Component({
  selector: 'app-ordenes-cliente-modal',
  templateUrl: './ordenes-cliente-modal.component.html',
  styleUrls: ['./ordenes-cliente-modal.component.scss'],
})
export class OrdenesClienteModalComponent implements OnInit {
  public pedidos: PedidoOrden[] = [];

  constructor(
    private route: ActivatedRoute,
    private pedidosSvc: PedidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerpedidosOrden();
  }

  obtenerpedidosOrden() {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.pedidosSvc.getPedidosByOrdenId(id).subscribe({
        next: (data) => {
          this.pedidos = data;
        },
        error: (error) => {
          console.error('Error al cargar la orden:', error);
        },
      });
    });
  }

  cerrarModal() {
    this.router.navigate(['/ordenesCliente']);
  }
}

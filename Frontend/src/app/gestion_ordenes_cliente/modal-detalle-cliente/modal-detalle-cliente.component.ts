import { Component, Input, OnInit } from '@angular/core';
import { PedidoOrden } from 'src/models/pedidoOrden';
import { PedidoService } from 'src/services/pedido.service';

@Component({
  selector: 'app-modal-detalle-cliente',
  templateUrl: './modal-detalle-cliente.component.html',
  styleUrls: ['./modal-detalle-cliente.component.scss'],
})
export class ModalDetalleClienteComponent implements OnInit {
  public pedidos: PedidoOrden[] = [];
  isVisible = false;
  orderId!: number;
  @Input() id!: number;

  constructor(private pedidosSvc: PedidoService) {}

  ngOnInit(): void {
    this.obtenerpedidosOrden(this.id);
  }

  obtenerpedidosOrden(id: number) {
    this.pedidosSvc.getPedidosByOrdenId(id).subscribe({
      next: (data) => {
        this.pedidos = data;
      },
      error: (error) => {
        console.error('Error al cargar la orden:', error);
      },
    });
  }

  close() {
    this.isVisible = false;
  }

  open(id: number) {
    this.isVisible = true;
    this.orderId = id;
    this.obtenerpedidosOrden(id);
  }
}

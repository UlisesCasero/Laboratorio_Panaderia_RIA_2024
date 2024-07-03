import { estadoPedido } from 'src/enums/estado-pedido';

export class PedidoVista {
  constructor(
    public idOrden: number,
    public idPedido: number,
    public idProducto: number,
    public productoNombre: string,
    public cantidad: number,
    public estado: estadoPedido
  ) {}
}

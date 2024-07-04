import { estadoOrden } from 'src/enums/estado-orden';
import { estadoPedido } from 'src/enums/estado-pedido';

export class OrdenVista {
  constructor(
    public idOrden: number,
    public idCliente: number,
    public clienteNombre: string,
    public fecha_entrega: string,
    public cantPedidos: number,
    public estadoOrden: estadoOrden,
    public entegada: boolean,
    public pedidos: {
      idPedido: number;
      idProducto: number;
    }[]
  ) {}
}

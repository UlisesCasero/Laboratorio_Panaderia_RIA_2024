export class InsumoPedido {
  constructor(
    public idInsumo: number,
    public idPedido: number,
    public idProducto: number,
    public insumoNombre: string,
    public cantidadIndividual: number,
    public cantidadTotal: number
  ) {}
}
export class Pedido {
    constructor(
        public id: number,
        public idProducto: number,
        public idOrden: number,
        public cantidad: number,
        public estado: string 
    ) {}
}

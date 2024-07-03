export class PedidoOrden {
    constructor(
        public nombre: string,
        public cantidad: number,
        public total: number,
        public estado: string 
    ) {}
}

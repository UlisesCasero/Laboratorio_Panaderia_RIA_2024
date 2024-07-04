export class OrdenCompra {
    constructor(
        public id: number,
        public idCliente: number,
        public total: number,
        public fecha_entrega: string,
        public idPanadero: number,
        public estado: string,
        public entregada: boolean,
        public asigando: boolean
    ) {}
}
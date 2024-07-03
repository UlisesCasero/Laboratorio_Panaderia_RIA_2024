export class ProductoCarrito {
    constructor(
        public id: number,
        public nombre: string,
        public descripcion: string,
        public imagen: string,
        public precio: number,
        public cantidad: number
    ) {}
}
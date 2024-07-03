import { Insumo } from "./insumo";

export class Producto {
    constructor(
        public id: number,
        public nombre: string,
        public descripcion: string,
        public imagen: string | ArrayBuffer | null, 
        public precio: number ,
        public insumo: Insumo[]
    ) {}
}

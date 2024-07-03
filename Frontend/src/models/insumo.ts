export class Insumo {
    constructor(
        public id: number,
        public nombre: string,
        public cantidad?: number,
    ) {}
} 

export class InsumoP {
    constructor(
        public id: number,
        public nombre: string,
        public cantidad?: number,
    ) {}
} 

export class InsumoCompleto {
    constructor(
        public id: number,
        public nombre: string,
        public cantidad: number,
    ) {}
} 

interface InsumoBasico {
    id: number;
    nombre: string;
  }
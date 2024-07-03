export class Usuario {
    constructor(
        public id: number,
        public email: string,
        public telefono: string,
        public role: string,
        public enabled: boolean 
    ) {}
}

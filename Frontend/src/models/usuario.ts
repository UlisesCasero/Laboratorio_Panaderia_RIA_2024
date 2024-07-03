export class Usuario {
    constructor(
        public id: number,
        public email: string,
        public telefono: string,
        public role: string,
        public enabled: boolean 
    ) {}
}

export class Usuario2 {
    constructor(
        public id: number,
        public email: string,
        public telefono: string,
        public role: string,
        public enabled: boolean,
        public password: string 
    ) {}
}

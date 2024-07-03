import { estadoOrden } from 'src/enums/estado-orden';

export class InsumoTotal {
  constructor(
    public insumoNombre: string, 
    public totalInsumo: number) {}
}

export class InsumoFiltro {
  constructor(
    public fecha_entrega: string,
    public estadoOrden: estadoOrden,
    public insumos: InsumoTotal[]
  ) {}
}

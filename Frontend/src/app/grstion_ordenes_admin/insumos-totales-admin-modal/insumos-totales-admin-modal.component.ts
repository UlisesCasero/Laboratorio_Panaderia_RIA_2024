import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
//import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InsumoFiltro, InsumoTotal } from 'src/models/insumoTotalesFiltro';
import { estadoOrden } from 'src/enums/estado-orden';
import { OrdenCompraService } from 'src/services/orden-compra.service';
import { OrdenesAdminService } from 'src/services/ordenes-admin.service';

@Component({
  selector: 'app-insumos-totales-admin-modal',
  templateUrl: './insumos-totales-admin-modal.component.html',
  styleUrls: ['./insumos-totales-admin-modal.component.scss'],
})
export class InsumosTotalesAdminModalComponent {
  //totalInsumos$: Observable<InsumoFiltro[]>;
  totalInsumosFiltrados: InsumoTotal[] = [];
  fechaDesde: string = '';
  fechaHsta: string = '';
  estado: string = '';
  estadosOrden = Object.values(estadoOrden);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesSvc: OrdenCompraService,
    private ordenesAdminSvc: OrdenesAdminService
    
  ) {
    this.setInitialDates();
  }

  ngOnInit(): void {
    this.obtenerTotalInsumos();
  }

  async obtenerTotalInsumos(): Promise<void> {
    this.ordenesAdminSvc.obtenerTotalInsumosAdmin();
    this.filtrarProductos();
  }

  cerrarModal() {
    this.router.navigate(['/ordenes-admin']);
  }

  setInitialDates(): void {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    this.fechaDesde = today.toISOString().split('T')[0];
    this.fechaHsta = nextWeek.toISOString().split('T')[0];
  }

  filtrarProductos(): void {
    const fechaInicio = this.fechaDesde;
    const fechaFin = this.fechaHsta;
    const estado = this.estado;
    this.totalInsumosFiltrados =
      this.ordenesAdminSvc.filtrarInsumosPorFechaYEstadoAdmin(
        fechaInicio,
        fechaFin,
        estado
      );
  }
}

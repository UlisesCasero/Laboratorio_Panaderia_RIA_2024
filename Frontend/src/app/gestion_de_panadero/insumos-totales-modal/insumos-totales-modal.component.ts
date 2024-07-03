import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InsumoFiltro, InsumoTotal } from 'src/models/insumoTotalesFiltro';
import { estadoOrden } from 'src/enums/estado-orden';

@Component({
  selector: 'app-insumos-totales-modal',
  templateUrl: './insumos-totales-modal.component.html',
  styleUrls: ['./insumos-totales-modal.component.scss'],
})
export class InsumosTotalesModalComponent implements OnInit {
  //totalInsumos$: Observable<InsumoFiltro[]>;
  totalInsumosFiltrados: InsumoTotal[] = [];
  fechaDesde: string = '';
  fechaHsta: string = '';
  estado: string = '';
  estadosOrden = Object.values(estadoOrden);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesPanaderoSvc: OrdenesPanaderoService
  ) {
    this.setInitialDates();
  }

  ngOnInit(): void {
    this.obtenerTotalInsumos();
  }

  async obtenerTotalInsumos(): Promise<void> {
    this.ordenesPanaderoSvc.obtenerTotalInsumos();
    this.filtrarProductos();
  }

  cerrarModal() {
    this.router.navigate(['/home']);
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
    this.totalInsumosFiltrados = this.ordenesPanaderoSvc.filtrarInsumosPorFechaYEstado(
      fechaInicio,
      fechaFin,
      estado
    );
  }
}

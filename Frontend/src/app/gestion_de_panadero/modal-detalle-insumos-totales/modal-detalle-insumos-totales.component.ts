import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { estadoOrden } from 'src/enums/estado-orden';
import { InsumoTotal } from 'src/models/insumoTotalesFiltro';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';

@Component({
  selector: 'app-modal-detalle-insumos-totales',
  templateUrl: './modal-detalle-insumos-totales.component.html',
  styleUrls: ['./modal-detalle-insumos-totales.component.scss']
})
export class ModalDetalleInsumosTotalesComponent implements OnInit {
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

  @Output() ordenesActualizadas2: EventEmitter<void> = new EventEmitter<void>();
  mostrar2: boolean = false;

  open(): void {
    this.mostrar2 = true;
  }

  close() {
    this.mostrar2 = false;
    this.ordenesActualizadas2.emit(); // Emitir evento de actualización al cerrar el modal
  }
}


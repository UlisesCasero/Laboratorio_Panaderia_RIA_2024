import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { estadoOrden } from 'src/enums/estado-orden';
import { InsumoTotal } from 'src/models/insumoTotalesFiltro';
import { OrdenCompraService } from 'src/services/orden-compra.service';
import { OrdenesAdminService } from 'src/services/ordenes-admin.service';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';

@Component({
  selector: 'app-modal-insumos-totales',
  templateUrl: './modal-insumos-totales.component.html',
  styleUrls: ['./modal-insumos-totales.component.scss']
})
export class ModalInsumosTotalesComponent implements OnInit{
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

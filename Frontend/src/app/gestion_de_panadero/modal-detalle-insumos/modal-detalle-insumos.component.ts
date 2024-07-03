import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InsumoPedido } from 'src/models/insumoPedido';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';

@Component({
  selector: 'app-modal-detalle-insumos',
  templateUrl: './modal-detalle-insumos.component.html',
  styleUrls: ['./modal-detalle-insumos.component.scss']
})
export class ModalDetalleInsumosComponent implements OnInit {
  insumosPedido$: Observable<InsumoPedido[]>;
  idOrden: number | null = null; // Variable para almacenar el idOrden

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenesPanaderoSvc: OrdenesPanaderoService
  ) {
    this.insumosPedido$ = this.ordenesPanaderoSvc.insumosPedido$;
  }

  ngOnInit(): void {
    this.insumosPedido$.subscribe((data) => {
      console.log('Insumos pedido: ', data);
    });
  }

  async obtenerInsumosPedidos(): Promise<void> {
    if (this.idOrden !== null) {
      console.log('ID: ', this.idOrden);
      try {
        const data = await this.ordenesPanaderoSvc.obtenerInsumosPedido(this.idOrden);
        console.log('Insumos obtenidos: ', data);
      } catch (error) {
        console.error('Error al obtener insumos:', error);
      }
    }
  }

  @Output() ordenesActualizadas2: EventEmitter<void> = new EventEmitter<void>();
  mostrar2: boolean = false;

  open(idOrden: number): void {
    this.idOrden = idOrden; // Almacenar el idOrden
    this.mostrar2 = true;
    this.obtenerInsumosPedidos(); // Obtener los insumos al abrir el modal
  }

  close() {
    this.mostrar2 = false;
    this.ordenesActualizadas2.emit(); // Emitir evento de actualización al cerrar el modal
  }

  cerrarModal() {
    this.close();
  }
}

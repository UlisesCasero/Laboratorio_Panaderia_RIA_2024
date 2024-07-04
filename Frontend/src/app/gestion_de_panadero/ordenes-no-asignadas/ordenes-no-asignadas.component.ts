import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrdenCompra } from 'src/models/ordenCompra';
import { Router } from '@angular/router';
import { OrdenVista } from 'src/models/ordenVistaPanadero';
import { OrdenCompraService } from 'src/services/orden-compra.service';
import { OrdenesPanaderoService } from 'src/services/ordenes-panadero.service';
import { ModalDetalleOrdenComponent } from '../modal-detalle-orden/modal-detalle-orden.component';

@Component({
  selector: 'app-ordenes-no-asignadas',
  templateUrl: './ordenes-no-asignadas.component.html',
  styleUrls: ['./ordenes-no-asignadas.component.scss']
})
export class OrdenesNoAsignadasComponent implements OnInit {
  ordenesSinAsignar$: Observable<OrdenVista[]>;
  mostrarConfirmacion = false;
  mostrarSinOrdenesMensaje: boolean = false;
  pageSize = 5;
  currentPage = 1;
  ordenes: OrdenVista[] = [];
  ordenAscendente: boolean = true;
  filtroFecha: string = '';
  ordenesOriginales: OrdenVista[] = [];
  
  constructor(private router: Router, private ordenesPanaderoSvc: OrdenesPanaderoService) {
    this.ordenesSinAsignar$ = this.ordenesPanaderoSvc.ordenSinAsignar$;
  }

  ngOnInit(): void {
    this.ordenesPanaderoSvc.obtenerOrdenesSinAsignar();
    this.ordenesSinAsignar$.subscribe((data) => {
      this.ordenes = data;
      this.ordenesOriginales = data;
    });

  }

  aplicarFiltroFecha() {
    if (this.filtroFecha) {
      const fechaSeleccionada = new Date(this.filtroFecha);
      const filtroFormateado = fechaSeleccionada.toISOString().split('T')[0];

      this.ordenesOriginales = this.ordenes.filter(orden => {
        const fechaOrden = orden.fecha_entrega.split('T')[0];

        console.log('fecha', fechaOrden === filtroFormateado);
        return fechaOrden === filtroFormateado;
      });
      console.log('fecha2', this.ordenesOriginales);
      this.ordenesOriginales = this.ordenes;

    } else {
      this.ordenesOriginales = this.ordenes;
    }
  }

  ordenarPorFecha() {
    if (this.ordenes) {
      this.ordenes.sort((a, b) => {
        if (this.ordenAscendente) {
          return new Date(a.fecha_entrega).getTime() - new Date(b.fecha_entrega).getTime();
        } else {
          return new Date(b.fecha_entrega).getTime() - new Date(a.fecha_entrega).getTime();
        }
      });
      this.ordenAscendente = !this.ordenAscendente;
    }
  }

  asignarOrdenPanadero(idOrden: number) {
    const idPanadero = Number(localStorage.getItem('userId'));
    this.ordenesPanaderoSvc.asignarPanadero(idPanadero, idOrden).subscribe({
      next: (data) => {
        this.ordenesPanaderoSvc.actualizarListaSinASignar();
        this.mostrarConfirmacion = true;
        setTimeout(() => {
          this.mostrarConfirmacion = false;
        }, 3000);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  mostrarMensaje() {
    this.mostrarConfirmacion = true;
  }
  @ViewChild(ModalDetalleOrdenComponent) crearProductoModal!: ModalDetalleOrdenComponent;

  openModalCreacion(idOrden: number) {
    if (this.crearProductoModal) {
      this.crearProductoModal.open(idOrden);
    } else {
      console.error('El modal aún no está disponible.');
    }
  }

  actualizarTabla() {
    this.ordenesPanaderoSvc.obtenerOrdenesPanadero();
  }

  verDetalle(idOrden: number, origen: string) {
    this.router.navigate(['/pedidos-orden', idOrden], {
      queryParams: { origen: origen }
    });
  }

  isPanadero(): boolean {
    const role = localStorage.getItem('rol');
    return role === 'PANADERO';
  }
}

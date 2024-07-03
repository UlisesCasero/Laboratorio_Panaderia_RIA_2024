import { Component, ViewChild } from '@angular/core';
import { Insumo } from 'src/models/insumo';
import { CrearInsumoComponent } from './crear-insumo/crear-insumo.component';
import { Subscription } from 'rxjs';
import { ProductoService } from 'src/services/producto.service';
import { ModalModificarComponent } from './modal-modificar/modal-modificar.component';

@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.component.html',
  styleUrls: ['./insumos.component.scss']
})
export class InsumosComponent {

  constructor(private productoSVC: ProductoService) { }
  insumos: Insumo[] = [];
  public lista: Insumo[] = [];
  public insumosOriginales: Insumo[] = [];
  paginaActual: number = 1;
  insumosPorPagina: number = 5;
  totalInsumos: number = 0;
  terminoBusqueda: string = '';

  ngOnInit(): void {
    this.obtenerInsumos();
  }

  private insumoSubscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.insumoSubscription.unsubscribe();
  }

  obtenerInsumos(): void {
    this.insumoSubscription.unsubscribe();
    this.insumoSubscription = this.productoSVC.getInsumos().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.insumos = data;
        } else {
          this.insumos = [data];
        }
        this.insumosOriginales = this.insumos.slice();
        console.log('Insumos cargados:', this.insumos);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  @ViewChild('crearInsumoModal') crearInsumoModal!: CrearInsumoComponent;
  openModalCreacion() {
    this.crearInsumoModal.open();
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  siguientePagina(): void {
    const ultimaPagina = Math.ceil(this.insumos.length / this.insumosPorPagina);
    if (this.paginaActual < ultimaPagina) {
      this.paginaActual++;
    }
  }

  get insumosPaginados(): Insumo[] {
    const indiceInicial = (this.paginaActual - 1) * this.insumosPorPagina;
    const indiceFinal = indiceInicial + this.insumosPorPagina;
    return this.insumos.slice(indiceInicial, indiceFinal);
  }

  filtrarInsumo(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (termino === '') {
      this.obtenerInsumos();
    } else {
      this.insumos = this.insumosOriginales.filter(insumo => {
        return insumo.nombre.toLowerCase().includes(termino);
      });
      this.paginaActual = 1;
    }
  }

  datosFormulario: any = {
    nombre: ''
  };

  resetFormulario(): void {
    this.terminoBusqueda = '';
    this.datosFormulario.nombre = '';
  }

  crearInsumo(datosFormulario: any): void {
    const nuevoInsumo = new Insumo(
      1,
      datosFormulario.nombre
    );

    console.log('Insumo creado:', nuevoInsumo);
    this.productoSVC.postInsumo(nuevoInsumo).subscribe({
      next: (data) => {
        console.log('Insumo creado:', data);
        this.obtenerInsumos();
        this.resetFormulario();
        this.crearInsumoModal.close();
      },
      error: (error) => {
        console.error('Error al crear insumo:', error);
      }
    });
  }

  eliminarInsumo(insumoId: number): void {
      this.productoSVC.deleteInsumo(insumoId).subscribe({
        next: (data) => {
          console.log('Insumo eliminado:', data);
          this.obtenerInsumos();
          this.mostrarMensajeExito2();
        },
        error: (error) => {
          this.mostrarMensajeError2(error);
          console.error('Error al eliminar insumo:', error);
        }
      });
  }

  mostrarMensajeExito2(): void {
    this.insumoEliminadoExitosamente = true;
    setTimeout(() => {
      this.insumoEliminadoExitosamente = false;
    }, 3000);
  }

  mensajeError: string = '';
  insumoEliminadoExitosamente = false;

  mostrarMensajeError2(mensaje: string): void {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = '';
    }, 5000);
  }
  ngAfterViewInit(): void {
  }
  @ViewChild('modificarInsumoModal') modificarInsumoModal!: ModalModificarComponent;
  openModalModificacion(insumo: Insumo) {
    if (this.modificarInsumoModal) {
      this.modificarInsumoModal.open(insumo);
    } else {
      console.error('Error: modificarInsumoModal no está definido.');
    }
  }
  

  modificarInsumo(insumo: Insumo): void {
    //this.openModalModificacion(insumo);
    const insumoModificado = { ...insumo };
    this.productoSVC.putInsumo(insumo.id, insumoModificado).subscribe({
      next: (data) => {
        console.log('Insumo modificado:', data);
        this.obtenerInsumos(); // Vuelve a cargar la lista de insumos después de modificar
      },
      error: (error) => {
        console.error('Error al modificar insumo:', error);
        // Muestra un mensaje de error si no se pudo modificar el insumo
        alert('Error al modificar el insumo. Por favor, intenta nuevamente.');
      }
    });
  }
}

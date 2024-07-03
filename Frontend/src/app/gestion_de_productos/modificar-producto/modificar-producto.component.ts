import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Insumo, InsumoP } from 'src/models/insumo';
import { Producto } from 'src/models/producto';
import { ProductoService } from 'src/services/producto.service';
import { InsumosModalComponent } from '../insumos-modal/insumos-modal.component';
import { Observable, Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-modificar-producto',
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.scss']
})
export class ModificarProductoComponent {
  isVisible = false;
  producto: Producto | null = null;
  imageUrl: string | null = null;
  imagenSeleccionada: string | ArrayBuffer | null = null;
  idsInsumosEliminados: number[] = [];
  insumos: InsumoP[] = [];
  insumossss: InsumoP[] = [];
  insumosParaEliminar: Insumo[] = [];
  insumosParaAgregar: InsumoP[] = [];
  mostrarModalInsumos = false;
  insumosSeleccionados: InsumoP[] = [];
  insumoSeleccionadoss: any[] = [];

  constructor(private productoSVC: ProductoService, private cd: ChangeDetectorRef) { }

  @Output() closed = new EventEmitter<void>();
  @Output() productoModificado = new EventEmitter<Producto>();
  @ViewChild('productoForm') productoForm!: NgForm;
  @ViewChild(InsumosModalComponent) insumosModal!: InsumosModalComponent;

  serverBaseUrl = 'http://localhost:3000/uploads/';

  open(producto: Producto) {
    if (producto.id) {
      this.loadInsumos(producto.id);
    } else {
      console.error('Producto es null');
    }
    this.producto = producto;
    this.isVisible = true;
    this.imageUrl = this.getImageUrl(producto.imagen);
    this.imagenSeleccionada = null;
    setTimeout(() => {
      this.productoForm.setValue({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio
      });
    });
  }

  cargarInsumos(productoId: number) {
    this.productoSVC.getInsumosYDescripciones(productoId).subscribe(
      (insumos: { id: number, nombre: string }[]) => {
        this.insumos = insumos;
      },
      (error) => {
        console.error('Error al cargar los insumos:', error);
      }
    );
    this.productoSVC.getInsumosIdsByProductoId2(productoId).subscribe(
      (insumos: InsumoP[]) => {
        this.insumos = insumos.map(insumo => ({ id: insumo.id, nombre: insumo.nombre, cantidad: insumo.cantidad }));
      },
      (error) => {
        console.error('Error al cargar los insumos:', error);
      }
    );
  }

  close() {
    this.isVisible = false;
    console.log('acaaa', this.insumosSeleccionados);
    this.closed.emit();
    this.insumosSeleccionados = [];
    this.idsInsumosEliminados = [];
  }

  getImageUrl(imageName: string | null | ArrayBuffer): string | null {
    if (typeof imageName === 'string') {
      return this.serverBaseUrl + imageName;
    } else {
      return null;
    }
  }

  eliminarInsumo(idInsumo: any): void {
    console.error('Error al cargar insumos:', idInsumo.nombre);
    this.productoSVC.getInsumosIdsByProductoId2(idInsumo.idProducto).subscribe(
      (data: InsumoP[]) => {
        this.insumossss = data;
        const insumosFiltrados = data.filter(item => item.nombre === idInsumo.nombre);
        console.log('Error al cargar insumos:', insumosFiltrados);
      },
      (error) => {
        console.error('Error al cargar insumos:', error);
      }
    );
    this.productoSVC.getInsumos2().subscribe(
      (data: Insumo[]) => {
        const insumosFiltrados = data.filter(item => item.nombre === idInsumo.nombre);
        console.log('Insumos encontrados:', insumosFiltrados);

        if (insumosFiltrados.length > 0) {
          const idInsumoFiltrado = insumosFiltrados[0].id;
          console.log('ID del insumo filtrado:', idInsumoFiltrado);

          // Guardar el ID en el array idsInsumosEliminados
          this.idsInsumosEliminados.push(idInsumoFiltrado);
          console.log('IDs de insumos eliminados:', this.idsInsumosEliminados);
        } else {
          console.log('No se encontraron insumos con el nombre:', idInsumo.nombre);
        }
      },
      (error) => {
        console.error('Error al cargar insumos:', error);
      }
    );
  }

  loadInsumos(idProducto: number) {
    this.productoSVC.getInsumosIdsByProductoId2(idProducto).subscribe(
      (data: InsumoP[]) => {
        this.insumos = data;
      },
      (error) => {
        console.error('Error al cargar insumos:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          this.imagenSeleccionada = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  @ViewChild('agregarInsumoModal') agregarInsumoModal!: InsumosModalComponent;
  private insumoAgregadoSubscription: Subscription | undefined;

  openModalRelacion() {
    this.agregarInsumoModal.open();
    if (!this.insumoAgregadoSubscription) {
      this.insumoAgregadoSubscription = this.agregarInsumoModal.insumoAgregado.subscribe(({ insumo, cantidad }) => {
        this.agregarInsumoo({ insumo, cantidad });
      });
    }
  }

  eliminarInsumoDelProducto(index: any): void {
    const insumoAEliminar = this.insumos[index.id];
   // this.insumosParaEliminar.push(insumoAEliminar);
    
    this.eliminarInsumo(index);
    this.insumos.splice(index.id, 1);
  }

  agregarInsumoSeleccionado(event: { insumo: Insumo, cantidad: number }): void {
    const { insumo, cantidad } = event;
    const nuevoInsumoP = new InsumoP(insumo.id, insumo.nombre, cantidad);
    this.insumosParaAgregar.push(nuevoInsumoP);
    console.log('Insumos seleccionados para agregar:', this.insumosParaAgregar);
  }

  insumoSeleccionados(insumo: any) {
    this.insumos.push(insumo);
    this.cerrarInsumosModal();
  }
  insumoss: any[] = [];
  openInsumosModal() {
    this.mostrarModalInsumos = true;
  }

  cerrarInsumosModal() {
    this.mostrarModalInsumos = false;
  }

  agregarInsumoo(event: { insumo: Insumo, cantidad: number }): void {
    const { insumo, cantidad } = event;
    const nuevoInsumoP = new InsumoP(insumo.id, insumo.nombre, cantidad);
    this.insumosSeleccionados.push(nuevoInsumoP);
    console.log('Insumos seleccionados en productos:', this.insumosSeleccionados);
  }

  descartarInsumoSeleccionado(insumoId: number) {
    console.log('Insumos seleccionados en productos:', insumoId);
    this.idsInsumosEliminados.push(insumoId);
    this.insumosSeleccionados = this.insumosSeleccionados.filter(insumo => insumo.id !== insumoId);
  }

  modificarProducto(producto: Producto): void {
    if (this.productoForm.valid && producto) {
      const insumosSeleccionadosReducidos = this.insumosSeleccionados.map(insumo => ({
        id: insumo.id,
        nombre: insumo.nombre,
        cantidad: insumo.cantidad
      }));
      console.log('sbrere', this.insumosSeleccionados);
      console.log('a eliminar s', this.idsInsumosEliminados);
      const formValues = this.productoForm.value;
      const productoModificado = new Producto(
        producto.id,
        formValues.nombre,
        formValues.descripcion,
        this.imagenSeleccionada || null,
        formValues.precio,
        insumosSeleccionadosReducidos
      );
      this.actualizarProducto(productoModificado);
      console.log('IANTES:', this.idsInsumosEliminados[0]);
      this.idsInsumosEliminados.forEach(idInsumo => {
        this.productoSVC.eliminarProductoInsumo(productoModificado.id, idInsumo).subscribe(
          (response) => {
            console.log(`Asociación del insumo ${idInsumo} con el producto ${productoModificado.id} eliminada con éxito:`, response);
          },
          (error) => {
            console.error(`Error al eliminar la asociación del insumo ${idInsumo} con el producto ${productoModificado.id}:`, error);
          }
        );
      });
      this.productoSVC.putProducto(productoModificado).subscribe({
        next: () => {
          const insumosParaEnviar = productoModificado.insumo.map(insumo => ({
            idProducto: productoModificado.id,
            idInsumo: insumo.id,
            cantidad: insumo.cantidad || 0
          }));
          console.log('Ifdsfdfrgre para eliminar:', this.idsInsumosEliminados);

          this.productoSVC.postProductoConInsumos(insumosParaEnviar).subscribe({
            next: (response) => {
              console.log('Insumos asociados al producto enviado:', response);
              // this.insumosSeleccionados = [];
              //this.idsInsumosEliminados = [];
            },
            error: (error) => {
              console.error('Error al asociar insumos al producto:', error);
            }
          });
        },
        error: (error) => {
          console.error('Error al guardar el producto:', error);
          // Manejar errores aquí si es necesario
        }
      });
      this.insumosSeleccionados = [];
      this.idsInsumosEliminados = [];
    }
  }
  insumosSeleccionados2: any[] = [];

  private actualizarProducto(productoModificado: Producto) {
    this.productoSVC.putProducto(productoModificado).subscribe({
      next: (data) => {
        console.log('Producto modificado:', data);
        this.productoModificado.emit(productoModificado);
        this.insumoSeleccionadoss = [];
        this.close();
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error al modificar producto:', error);
      }
    });
  }
  pageSize: number = 5;
  currentPage: number = 1;
  get totalPages(): number {
    return Math.ceil(this.insumos.length / this.pageSize);
  }

  get visibleInsumos(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.insumos.slice(startIndex, startIndex + this.pageSize);
  }
  insumosPaginados: InsumoP[] = []; // Lista de insumos mostrados en la página actual
  itemsPorPagina = 5; // Número de insumos por página
  paginaActual = 0;
  siguientePagina() {
    this.paginaActual++;
    this.actualizarInsumosPaginados();
  }

  // Método para retroceder a la página anterior
  paginaAnterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarInsumosPaginados();
    }
  }

  // Método para actualizar los insumos mostrados en función de la página actual
  actualizarInsumosPaginados() {
    const inicio = this.paginaActual * this.itemsPorPagina;
    this.insumosPaginados = this.insumos.slice(inicio, inicio + this.itemsPorPagina);
    console.log('dsdsdsd', this.insumos)
  }
}


import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Producto } from 'src/models/producto';
import { ProductoService } from 'src/services/producto.service';
import { CrearProductoComponent } from '../crear-producto/crear-producto.component';
import { ModificarProductoComponent } from '../modificar-producto/modificar-producto.component';
import { Insumo, InsumoP } from 'src/models/insumo';
import { Subscription } from 'rxjs';
import { InsumosModalComponent } from '../insumos-modal/insumos-modal.component';

@Component({
  selector: 'app-crud-productos',
  templateUrl: './crud-productos.component.html',
  styleUrls: ['./crud-productos.component.scss']
})
export class CRUDProductosComponent implements OnInit {

  @ViewChild('imagenInput') imagenInputRef!: ElementRef<HTMLInputElement>;
  imagenSeleccionada: string | ArrayBuffer | null = null;
  insumo: Insumo | null = null;
  insumoss2: { insumo: Insumo, cantidad: number }[] = [];
  serverBaseUrl = 'http://localhost:3000/uploads/';
  mensajeError: string = '';
  productoEliminadoExitosamente = false;
  public lista: Producto[] = [];
  public productosActuales: Producto[] = [];
  public productosOriginales: Producto[] = [];
  paginaActual: number = 1;
  productosPorPagina: number = 5;
  totalProductos: number = 0;
  terminoBusqueda: string = '';
  private productoSubscription: Subscription = new Subscription();
  public productos: Producto[] = [];
  insumoSeleccionado: Insumo | null = null;
  insumoHardcodeado: Insumo[] = [{ id: 1, nombre: 'Harina' }];
  insumosHardcodeados: Insumo[] = [{ id: 1, nombre: 'Harina' }];
  insumosSeleccionados: InsumoP[] = [];
  insumoSeleccionadoss: any[] = [];
  errorAlCrearProducto: string = '';
  productoCreadoExitosamente = false;
  insumoss: any[] = [];
  mostrarModalInsumos = false;
  datosFormulario: any = {
    nombre: '',
    descripcion: '',
    precio: null,
  };

  constructor(private productoSVC: ProductoService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }
  
  ngOnDestroy(): void {
    this.productoSubscription.unsubscribe();
  }

  openFilePicker(): void {
    if (this.imagenInputRef && this.imagenInputRef.nativeElement) {
      this.imagenInputRef.nativeElement.click();
    }
  }

  getImageUrl(imageName: string | null | ArrayBuffer): string {
    if (typeof imageName === 'string') {
      return this.serverBaseUrl + imageName;
    } else {
      return '';
    }
  }

  obtenerProductos(): void {
    this.productoSubscription.unsubscribe();
    this.productoSubscription = this.productoSVC.getProductos().subscribe({
      next: (data) => {
        this.productosOriginales = data;
        if (this.terminoBusqueda.trim() !== '') {
          this.productos = this.productosOriginales.filter(producto =>
            producto.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
          );
        } else {
          this.productos = [...data];
        }
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  seleccionarInsumo(insumo: Insumo): void {
    this.insumoSeleccionado = insumo;
  }

  @ViewChild('crearProductoModal') crearProductoModal!: CrearProductoComponent;
  openModalCreacion() {
    this.crearProductoModal.open();
  }
  @ViewChild('agregarInsumoModal') agregarInsumoModal!: InsumosModalComponent;
  openModalRelacion() {
    this.agregarInsumoModal.open();
    this.agregarInsumoModal.insumoAgregado.subscribe(({ insumo, cantidad }) => {
      this.agregarInsumo({ insumo, cantidad });
    });
  }

  agregarInsumo(event: { insumo: Insumo, cantidad: number }): void {
    const { insumo, cantidad } = event;
    const nuevoInsumoP = new InsumoP(insumo.id, insumo.nombre, cantidad);
    this.insumosSeleccionados.push(nuevoInsumoP);
    console.log('Insumos seleccionados en productos:', this.insumosSeleccionados);
  }

  @ViewChild('modificarProductoModal') modificarProductoModal!: ModificarProductoComponent;
  openModalModificacion(producto: Producto) {
    this.modificarProductoModal.open(producto);
  }

  modificarProducto(productoModificado: Producto) {
    this.productoSVC.putProducto(productoModificado).subscribe({
      next: (data) => {
        console.log('Producto modificado:', data);
        this.productoSVC.getProductos().subscribe({
          next: (productos) => {
            this.productos = productos;
            this.cd.detectChanges();
          },
          error: (error) => {
            console.error(error);
          }
        });
      },
      error: (error) => {
        console.error('Error al modificar producto:', error);
      }
    });
  }

  eliminarProducto(productoId: number): void {
    this.productoSVC.delteProducto(productoId).subscribe({
      next: (data) => {
        console.log('Producto eliminado:', data);
        if (this.terminoBusqueda.trim() === '') {
          // No hay filtro, actualizar lista completa de productos
          this.productos = this.productos.filter(p => p.id !== productoId);
        } else {
          // Hay filtro, eliminar de la lista filtrada y actualizar lista original si es necesario
          this.productos = this.productos.filter(p => p.id !== productoId);
          const productoEliminado = this.productosOriginales.find(p => p.id === productoId);
          if (productoEliminado) {
            this.productosOriginales = this.productosOriginales.filter(p => p.id !== productoId);
            if (this.terminoBusqueda.trim() !== '') {
              this.productos = this.productosOriginales.filter(producto =>
                producto.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
              );
            }
          }
        }
        this.mostrarMensajeExito2(); 
      },
      error: (error) => {
        this.mostrarMensajeError2(error); 
      }
    });
  }

  mostrarMensajeExito2(): void {
    this.productoEliminadoExitosamente = true;
    setTimeout(() => {
      this.productoEliminadoExitosamente = false;
    }, 3000);
  }

  mostrarMensajeError2(mensaje: string): void {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = '';
    }, 5000);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  siguientePagina(): void {
    const ultimaPagina = Math.ceil(this.productos.length / this.productosPorPagina);
    if (this.paginaActual < ultimaPagina) {
      this.paginaActual++;
    }
  }

  get productosPaginados(): Producto[] {
    const indiceInicial = (this.paginaActual - 1) * this.productosPorPagina;
    const indiceFinal = indiceInicial + this.productosPorPagina;
    return this.productos.slice(indiceInicial, indiceFinal);
  }

  filtrarProductos(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (termino === '') {
      this.obtenerProductos();
      this.productosActuales = [...this.productosOriginales];
    } else {
      this.productos = this.productosOriginales.filter(producto =>
        producto.nombre.toLowerCase().includes(termino) &&
        this.productos.some(p => p.id === producto.id)
      );
    }
    this.paginaActual = 1;
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

  mostrarMensajeExito() {
    this.productoCreadoExitosamente = true;
    setTimeout(() => {
      this.productoCreadoExitosamente = false;
    }, 3000);
  }

  mostrarMensajeError(mensaje: string) {
    this.errorAlCrearProducto = mensaje;
    setTimeout(() => {
      this.errorAlCrearProducto = '';
    }, 5000);
  }

  resetFormulario(): void {
    this.imagenSeleccionada = null;
    this.terminoBusqueda = '';
    this.datosFormulario.nombre = '';
    this.datosFormulario.descripcion = '';
    this.datosFormulario.precio = null;
    this.insumosSeleccionados = [];
    if (this.imagenInputRef && this.imagenInputRef.nativeElement) {
      this.imagenInputRef.nativeElement.value = '';
    }
  }

  crearProducto(datosFormulario: any): void {
    if (!this.imagenSeleccionada) {
      console.error('No se ha seleccionado una imagen válida.');
      return;
    }
    const insumosSeleccionadosReducidos = this.insumosSeleccionados.map(insumo => ({
      id: insumo.id,
      nombre: insumo.nombre
    }));

    const nuevoProducto = new Producto(
      1,
      datosFormulario.nombre,
      datosFormulario.descripcion,
      this.imagenSeleccionada,
      datosFormulario.precio,
      insumosSeleccionadosReducidos
    );

    console.log('Producto creado:', nuevoProducto);
    this.productoSVC.postProducto(nuevoProducto).subscribe({
      next: (data) => {
        const insumosParaEnviar: {
          idProducto: number;
          idInsumo: number;
          cantidad: number;
        }[] = this.insumosSeleccionados.map(insumo => ({
          idProducto: data.id,
          idInsumo: insumo.id,
          cantidad: insumo.cantidad || 0
        }));

        this.productoSVC.postProductoConInsumos(insumosParaEnviar).subscribe({
          next: (response) => {
            console.log('Insumos asociados al producto enviado:', response);
          },
          error: (error) => {
            console.error('Error al asociar insumos al producto:', error);
            this.mostrarMensajeError('Error al asociar insumos al producto. Por favor, intenta nuevamente.');
          }
        });
        console.log('Insumos seleccionados para enviar:', insumosParaEnviar);

        console.log('Producto creado:', data);
        this.obtenerProductos();
        this.resetFormulario();
        this.mostrarMensajeExito();
        this.insumosSeleccionados.forEach(insumo => {
          console.log(`ID: ${insumo.id}, Nombre: ${insumo.nombre}, Cantidad: ${insumo.cantidad}`);
        });

        setTimeout(() => {
          this.crearProductoModal.close();
        }, 2000);

      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        setTimeout(() => {
          this.mostrarMensajeError('Error al crear producto. Por favor, intenta nuevamente.');
        }, 2000);
      }
    });

  }

  insumoSeleccionados(insumo: any) {
    this.insumoss.push(insumo);
    this.cerrarInsumosModal();
  }

  openInsumosModal() {
    this.mostrarModalInsumos = true;
  }

  cerrarInsumosModal() {
    this.mostrarModalInsumos = false;
  }
}
import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/services/servicios.service';
import { CarritoService } from 'src/services/carrito.service';
import { ProductoService } from 'src/services/producto.service';
import { ProductoCarrito } from 'src/models/productoCarrito';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss']
})
export class HomeClienteComponent {
  productos: ProductoCarrito[] = [];
  productosFiltrados: ProductoCarrito[] = [];
  terminoBusqueda: string = '';
  notificationMessage: string = '';
  carritoSub!: Subscription;
  
  constructor(private serviciosService: ServiciosService, private carritoSvc: CarritoService, private productosSvc: ProductoService) { }

  ngOnInit(): void {
    this.obtenerProductos();
    this.carritoSub = this.carritoSvc.miCarrito$.subscribe((data) => {
      this.actualizarCantidades(data);
    });
  }

  ngOnDestroy(): void {
    if (this.carritoSub) {
      this.carritoSub.unsubscribe();
    }
  }

  obtenerProductos() {
    this.productosSvc.getProductosCarrito().subscribe(
      (data) => {
        this.productos = data;
        this.productosFiltrados = this.productos;
        this.carritoSvc.miCarrito$.pipe(take(1)).subscribe(carrito => {
          this.actualizarCantidades(carrito);
        });
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }


  actualizarCantidades(carrito: ProductoCarrito[]) {
    this.productos.forEach((producto) => {
      const productoEnCarrito = carrito.find(p => p.id === producto.id);
      if (productoEnCarrito) {
        producto.cantidad = productoEnCarrito.cantidad;
      } else {
        producto.cantidad = 0;
      }
    });
    this.productosFiltrados = [...this.productos];
  }

  addCarrito(producto: ProductoCarrito) {
    console.log('PRODUCTO: ', producto);
    this.notificationMessage = 'Agregado!';
    setTimeout(() => {
      this.notificationMessage = '';
    }, 500);
    this.carritoSvc.addProducto(producto);
  }
  
  serverBaseUrl = 'http://localhost:3000/uploads/';

  getImageUrl(imageName: string | null | ArrayBuffer): string {
    if (typeof imageName === 'string') {
      return this.serverBaseUrl + imageName;
    } else {
      return '';
    }
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('rol');
    return role === 'ADMIN';
  }

  isUser(): boolean {
    const role = localStorage.getItem('rol');
    return role === 'USER';
  }

  isPanadero(): boolean {
    const role = localStorage.getItem('rol');
    return role === 'PANADERO';
  }

  actualizarCantidad(id: number, operacion: string) {
    this.carritoSvc.actualizarCantidad(id, operacion);
  }

  borrarProd(id: number) {
    this.carritoSvc.eliminarProd(id);
  }

  filtrarProductos(): void {
    const nombresProductos = this.productos.map(producto => producto.nombre.toLowerCase());
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (termino === '') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter((productos, index) =>
        nombresProductos[index].includes(termino),
        console.log('aaadsdf', this.productosFiltrados)
      );
    }
    console.log(termino);
  }
}

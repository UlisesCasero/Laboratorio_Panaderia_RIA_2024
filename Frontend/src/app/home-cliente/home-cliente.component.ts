import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/services/servicios.service';
import { CarritoService } from 'src/services/carrito.service';
import { Producto } from 'src/models/producto';
import { ProductoService } from 'src/services/producto.service';
import { ProductoCarrito } from 'src/models/productoCarrito';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss']
})
export class HomeClienteComponent {
  productos: any[] = [];
  notificationMessage: string = '';
  productosFiltrados: any[] = [];
  terminoBusqueda: string = '';
  constructor(private serviciosService: ServiciosService, private carritoSvc: CarritoService, private productosSvc: ProductoService) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos() {
    if (this.isUser()) {
      this.productosSvc.getProductosCarrito()
        .subscribe(
          (data) => {
            this.productos = data;
            this.productosFiltrados = this.productos;
            console.log('productos:', this.productos);
          },
          (error) => {
            console.error('Error al obtener productos:', error);
          }
        );
    } else {
      console.log('El usuario no tiene permisos para obtener productos.');
    }
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

  addCarrito(producto: ProductoCarrito) {
    console.log('PRODUCTO: ', producto);
    this.notificationMessage = 'Agregado!';
    setTimeout(() => {
      this.notificationMessage = '';
    }, 500);
    return this.carritoSvc.addProducto(producto);
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

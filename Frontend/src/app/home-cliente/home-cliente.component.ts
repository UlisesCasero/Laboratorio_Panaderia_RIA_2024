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

  addCarrito(producto: ProductoCarrito){
    console.log('PRODUCTO: ',producto);
    return this.carritoSvc.addProducto(producto);
  }
}

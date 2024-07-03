import { Component } from '@angular/core';
import { ProductoCarrito } from 'src/models/productoCarrito';
import { CarritoService } from 'src/services/carrito.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent {
  cantCarrito: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.miCarrito$.subscribe((productos: ProductoCarrito[]) => {
      this.cantCarrito = productos.reduce((acc, producto) => acc + producto.cantidad, 0);
    });
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
}

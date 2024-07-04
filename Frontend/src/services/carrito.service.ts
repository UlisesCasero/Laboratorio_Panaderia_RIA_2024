import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductoCarrito } from 'src/models/productoCarrito';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private miLista: ProductoCarrito[] = [];
  private miCarrito = new BehaviorSubject<ProductoCarrito[]>(this.miLista);
  
  miCarrito$ = this.miCarrito.asObservable();
  
  addProducto(producto: ProductoCarrito) {
    const productoExistente = this.miLista.find(
      (p) => p.id === producto.id
    );
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      producto.cantidad = 1;
      this.miLista.push(producto);
    }
    this.miCarrito.next(this.miLista);
  }

  actualizarCantidad(id: number, operacion: string) {
    const producto = this.miLista.find((p) => p.id === id);
    if (producto) {
      if (operacion === 'add') {
        producto.cantidad += 1;
      } else if (operacion === 'minus' && producto.cantidad > 0) {
        producto.cantidad -= 1;
      }
      if (producto.cantidad === 0) {
        this.eliminarProd(id);
      } else {
        this.miCarrito.next(this.miLista);
      }
    }
  }
  
  eliminarProd(id: number) {
    this.miLista = this.miLista.filter((prod) => prod.id !== id);
    this.miCarrito.next(this.miLista);
  }

  buscarProdPorId(id: number): ProductoCarrito | undefined {
    return this.miLista.find((prod) => prod.id === id);
  }

  totalCarrito() {
    return this.miLista.reduce((total, producto) => total + producto.cantidad * producto.precio, 0);
  }

  vaciarCarrito() {
    this.miLista = [];
    this.miCarrito.next(this.miLista);
  }

  getCantidadProducto(id: number): number {
    const producto = this.miLista.find((prod) => prod.id === id);
    return producto ? producto.cantidad : 0;
  }
}

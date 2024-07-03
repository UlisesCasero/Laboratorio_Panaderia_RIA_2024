import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Producto } from 'src/models/producto';
import { ProductoCarrito } from 'src/models/productoCarrito';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  constructor() {
    HttpCliente: HttpClient;
  }

  //Lista de carrito
  private miLista: ProductoCarrito[] = [];

  //Carrito observable
  private miCarrito = new BehaviorSubject<ProductoCarrito[]>([]);
  miCarrito$ = this.miCarrito.asObservable();

  addProducto(producto: ProductoCarrito) {
    console.log('MI LISTA: ', this.miLista);
    if (this.miLista.length === 0) {
      producto.cantidad = 1;
      this.miLista.push(producto);
      this.miCarrito.next(this.miLista);
    } else {
      const productoModificado = this.miLista.find((element) => {
        return element.id === producto.id;
      });
      if (productoModificado) {
        productoModificado.cantidad += 1;
        this.miCarrito.next(this.miLista);
      } else {
        producto.cantidad = 1;
        this.miLista.push(producto);
        this.miCarrito.next(this.miLista);
      }
    }
  }

  eliminarProd(id: number) {
    this.miLista = this.miLista.filter((prod) => {
      return prod.id != id;
    });
    this.miCarrito.next(this.miLista);
  }

  buscarProdPorId(id: number) {
    return this.miLista.find((prod) => {
      return prod.id === id;
    });
  }

  totalCarrito() {
    const total = this.miLista.reduce(function (acumulador, producto) {
      return acumulador + producto.cantidad * producto.precio;
    }, 0);
    return total;
  }

  vaciarCarrito() {
    this.miLista = [];
    this.miCarrito.next(this.miLista);
  }

}

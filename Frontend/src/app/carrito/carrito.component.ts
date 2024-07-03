import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, take } from 'rxjs';
import { OrdenCompra } from 'src/models/ordenCompra';
import { Pedido } from 'src/models/pedido';
import { ProductoCarrito } from 'src/models/productoCarrito';
import { CarritoService } from 'src/services/carrito.service';
import { OrdenCompraService } from 'src/services/orden-compra.service';
import { PedidoService } from 'src/services/pedido.service';
import { estadoOrden } from '../../enums/estado-orden';
import { estadoPedido } from 'src/enums/estado-pedido';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit {
  miCarrito$: Observable<ProductoCarrito[]>;
  mensajeConfirmacion: string = '';
  fechaEntrega: string = '';
  minDate: string;
  carritoSub!: Subscription;
  hayProductos: boolean = false;


  constructor(
    private carritoSvc: CarritoService,
    private ordenCompraSvc: OrdenCompraService,
    private pedidoSvc: PedidoService,
  ) {
    this.miCarrito$ = this.carritoSvc.miCarrito$;
    this.minDate = new Date().toISOString().split('T')[0]; 
  }

  ngOnInit(): void {
    this.carritoSub = this.miCarrito$.subscribe((data) => {
      console.log('Productos en el carrito:', data);
      this.hayProductos = data.length > 0;
    });
  }

  ngOnDestroy(): void {
    this.carritoSub.unsubscribe();
  }

  total(precio: number, unidades: number) {
    return precio * unidades;
  }

  borrarProd(id: number) {
    this.carritoSvc.eliminarProd(id);
  }

  actualizarCantidad(operacion: string, id: number) {
    const producto = this.carritoSvc.buscarProdPorId(id);
    if (producto) {
      if (operacion === 'minus' && producto.cantidad > 0) {
        producto.cantidad -= 1;
      }
      if (operacion === 'add') {
        producto.cantidad += 1;
      }
      if (producto.cantidad === 0) {
        this.carritoSvc.eliminarProd(id);
      }
    }
  }

  totalCarrito() {
    return this.carritoSvc.totalCarrito();
  }

  // falla
  crearPedido(producto: ProductoCarrito, idOrden: number) {
    console.log('Producto para pedido: ', producto);
    const nuevoPedido = new Pedido(
      null!,
      producto.id,
      idOrden,
      producto.cantidad,
      estadoPedido.PENDIENTE
    );

    console.log('El pedido genereado: ', nuevoPedido);
    this.pedidoSvc.postPedido(nuevoPedido).subscribe(
      (response) => {
        console.log('Pedido creado:', response);
      },
      (error) => console.error('Error al crear la orden:', error)
    );
  }

  crearOrdenCompra() {
    const id = localStorage.getItem('userId');
    if (id !== null) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        const nuevaOrdenCompra = new OrdenCompra(
          null!,
          numericId,
          this.totalCarrito(),
          this.fechaEntrega,
          null!,
          estadoOrden.PENDIENTE,
          false
        );
        console.log('LLEGA AHSTA ACA 1');

        this.ordenCompraSvc.postOrdenCompra(nuevaOrdenCompra).subscribe(
          (response) => {
            this.carritoSub.unsubscribe();
            //this.ordenesPanaderoSvc.actualizarListaSinASignar();
            console.log('Response: ', response.id);
            //console.log('Orden creada:', response);
            this.miCarrito$.pipe(take(1)).subscribe((productos) => {
              productos.forEach((producto) => {
                this.crearPedido(producto, response.id);
              });
            });
            this.carritoSvc.vaciarCarrito();
            this.mensajeConfirmacion = 'Orden realizada!';
            setTimeout(() => {
              this.mensajeConfirmacion = '';
            }, 3000);
          },
          (error) => console.error('Error al crear la orden:', error)
        );
      } else {
        console.error('ID de usuario no es un número válido');
      }
    } else {
      console.error('No se encontró el ID de usuario en localStorage');
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
}

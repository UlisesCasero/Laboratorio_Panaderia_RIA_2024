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
import { ServiciosService } from 'src/services/servicios.service';
import { Router } from '@angular/router';

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
  idOrden!: number;

  comprobarCarrito() {
    this.miCarrito$.pipe(take(1)).subscribe((data) => {
      this.hayProductos = data.length > 0;
    });
  }

  constructor(
    private carritoSvc: CarritoService,
    private ordenCompraSvc: OrdenCompraService,
    private pedidoSvc: PedidoService,
    private service: ServiciosService,
    private router: Router
  ) {
    this.miCarrito$ = this.carritoSvc.miCarrito$;
    this.minDate = new Date().toISOString().split('T')[0];
  }
  emailUsuario!: string;
  ngOnInit(): void {
    this.carritoSub = this.miCarrito$.subscribe((data) => {
      this.hayProductos = data.length > 0;
    });
    this.service.obtenerUsuarioPorId().subscribe(
      (usuario) => {
        this.emailUsuario = usuario.email;
      },
      (error) => {
        console.error('Error al obtener el usuario', error);
      }
    );
    this.comprobarCarrito();
  }

  ngOnDestroy(): void {
    this.carritoSub.unsubscribe();
  }

  total(precio: number, unidades: number) {
    return precio * unidades;
  }

  borrarProd(id: number) {
    this.carritoSvc.eliminarProd(id);
    this.comprobarCarrito();
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
      this.comprobarCarrito();
    }
  }

  totalCarrito() {
    return this.carritoSvc.totalCarrito();
  }

  crearPedido(producto: ProductoCarrito, idOrden: number) {
    const nuevoPedido = new Pedido(
      null!,
      producto.id,
      idOrden,
      producto.cantidad,
      estadoPedido.PENDIENTE
    );
    this.pedidoSvc.postPedido(nuevoPedido).subscribe(
      (response) => {},
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
          false,
          false
        );
        this.ordenCompraSvc.postOrdenCompra(nuevaOrdenCompra).subscribe(
          (response) => {
            this.carritoSub.unsubscribe();
            //this.ordenesPanaderoSvc.actualizarListaSinASignar();
            this.miCarrito$.pipe(take(1)).subscribe((productos) => {
              productos.forEach((producto) => {
                this.crearPedido(producto, response.id);
                this.idOrden = response.id;
              });
            });
            this.service
              .enviarEmailConPedidos(this.idOrden, this.emailUsuario)
              .subscribe(
                (response) => {},
                (error) => {}
              );
            this.mensajeConfirmacion = 'Orden realizada!';
            setTimeout(() => {
              this.mensajeConfirmacion = '';
            }, 3000);
            setTimeout(() => {
              this.vaciarCarrito();
              this.mensajeConfirmacion = '';
            }, 3000);
            setTimeout(() => {
              this.mensajeConfirmacion = 'Vaciando Carrito.....!';
            }, 2000);
            setTimeout(() => {}, 1000);
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

  vaciarCarrito() {
    this.carritoSvc.vaciarCarrito();
    this.fechaEntrega = '';
  }

  cancelarCarrito() {
    this.vaciarCarrito();
    this.router.navigate(['/home']);
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

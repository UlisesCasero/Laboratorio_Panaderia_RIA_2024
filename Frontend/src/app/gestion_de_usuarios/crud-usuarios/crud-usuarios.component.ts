import { ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Usuario } from 'src/models/usuario';
import { ServiciosService } from 'src/services/servicios.service';
import { ModalCrearUserComponent } from './modal-crear-user/modal-crear-user.component';
import { NgForm } from '@angular/forms';
import { ModalModifUserComponent } from './modal-modif-user/modal-modif-user.component';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.component.html',
  styleUrls: ['./crud-usuarios.component.scss']
})
export class CrudUsuariosComponent {

  paginaActual: number = 1;
  usuariosPorPagina: number = 5;
  totalUsuarios: number = 0;
  terminoBusqueda: string = '';
  public usuarioss: Usuario[] = [];
  public productosActuales: Usuario[] = [];
  notification: { message: string, type: string } = { message: '', type: '' };
  usuarioSeleccionado!: Usuario;
  public lista: Usuario[] = [];
  public usuariosOriginales: Usuario[] = []; 
 
  constructor(private usuarios: ServiciosService, private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
   this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuarios.obtenerUsuarios().subscribe({
      next: (data) => {
        this.lista = data;
        this.usuariosOriginales = data;
        if (this.terminoBusqueda.trim() !== '') {
          this.usuarioss = this.usuariosOriginales.filter(producto =>
            producto.email.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
          );
        } else {
          this.usuarioss = [...data];
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  eliminarProducto(userId: number) {
   
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  siguientePagina(): void {
    const ultimaPagina = Math.ceil(this.usuarioss.length / this.usuariosPorPagina);
    if (this.paginaActual < ultimaPagina) {
      this.paginaActual++;
    }
  }

  get usuariosPaginados(): Usuario[] {
    const indiceInicial = (this.paginaActual - 1) * this.usuariosPorPagina;
    const indiceFinal = indiceInicial + this.usuariosPorPagina;
    return this.usuarioss.slice(indiceInicial, indiceFinal);
  }

  filtrarProductos(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (termino === '') {
      this.obtenerUsuarios();
      this.productosActuales = [...this.usuariosOriginales];
    } else {
      this.usuarioss = this.usuariosOriginales.filter(producto =>
        producto.email.toLowerCase().includes(termino) &&
        this.usuarioss.some(p => p.id === producto.id)
      );
    }
    this.paginaActual = 1;
  }
  

  @ViewChild('crearProductoModal') crearProductoModal!: ModalCrearUserComponent;
  openModalCreacion() {
    this.crearProductoModal.open();
    this.crearProductoModal.insumoAgregado.subscribe(({ usuario }) => {
      this.actualizarListaUsuarios();
       });
  }

@ViewChild('crearProductoModal2') crearProductoModal2!: ModalModifUserComponent;
openModalCreacion2(id: number) {
  this.crearProductoModal2.open(id);
  this.crearProductoModal2.usuarioModificado.subscribe(() => {
    this.actualizarListaUsuarios();
  });
}

descativar(usuario: Usuario) {
  if (usuario.enabled) {
    this.usuarios.desactivar({ id: usuario.id }).subscribe(
      response => {
        this.notification = { message: 'Usuario desactivado correctamente', type: 'success' };
        setTimeout(() => {
          this.notification = { message: '', type: '' };
        }, 3000);
        this.actualizarListaUsuarios();
      },
      error => {
        this.notification = { message: 'Error al desactivar usuario', type: 'error' };
        setTimeout(() => {
          this.notification = { message: '', type: '' };
        }, 3000);
      }
    );
  } else {
    this.usuarios.activar({ id: usuario.id }).subscribe(
      response => {
        this.notification = { message: 'Usuario activado correctamente', type: 'success' };
        setTimeout(() => {
          this.notification = { message: '', type: '' };
        }, 3000);
        this.actualizarListaUsuarios();
      },
      error => {
        this.notification = { message: 'Error al activar usuario', type: 'error' };
        setTimeout(() => {
          this.notification = { message: '', type: '' };
        }, 3000);
      }
    );
  }
}

actualizarListaUsuarios(): void {
  this.usuarios.obtenerUsuarios().subscribe({
    next: (data) => {
      this.usuariosOriginales = data;
      this.filtrarProductos(); 
    },
    error: (error) => {
      console.error(error);
    }
  });
}
}

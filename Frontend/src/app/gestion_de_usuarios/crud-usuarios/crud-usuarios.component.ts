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
        console.log(this.usuarios)
        this.filtrarProductos();
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
   
  }  

  filtrarProductos(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (termino === '') {
      this.lista = [...this.usuariosOriginales]; 
    } else {
      this.lista = this.usuariosOriginales.filter(usuario => {
        return usuario.email.toLowerCase().includes(termino);
      });
      this.paginaActual = 1; 
    }
  }

  @ViewChild('crearProductoModal') crearProductoModal!: ModalCrearUserComponent;
  openModalCreacion() {
    this.crearProductoModal.open();
    this.crearProductoModal.insumoAgregado.subscribe(({ usuario }) => {
      //  this.agregarInsumo({ insumo, cantidad });
       });
  }

usuarioSeleccionado: Usuario | undefined; 
@ViewChild('crearProductoModal2') crearProductoModal2!: ModalModifUserComponent;
openModalCreacion2(usuario: Usuario) {
  this.usuarioSeleccionado = usuario; 
  this.crearProductoModal2.usuario = this.usuarioSeleccionado; 
  this.crearProductoModal2.open();
  this.crearProductoModal2.insumoAgregado.subscribe(({ usuario }) => {
    //  this.agregarInsumo({ insumo, cantidad });
     });
}

}

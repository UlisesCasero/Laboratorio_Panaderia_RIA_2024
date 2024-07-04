import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario, Usuario2 } from 'src/models/usuario';
import { ServiciosService } from 'src/services/servicios.service';

@Component({
  selector: 'app-modal-modif-user',
  templateUrl: './modal-modif-user.component.html',
  styleUrls: ['./modal-modif-user.component.scss'],
})
export class ModalModifUserComponent implements OnInit {
  mostrar: boolean = false;
  registroExitoso: boolean = false;
  registroFallido: boolean = false;
  usuario: Usuario2 = {
    id: 0,
    email: '',
    telefono: '',
    role: '',
    enabled: true,
    password: '',
  };

  @Output() usuarioModificado = new EventEmitter<Usuario>();

  constructor(private servicio: ServiciosService) {}

  ngOnInit() {}

  close() {
    this.mostrar = false;
  }

  actualizarUsuario() {
    this.servicio.actualizarUsuario(this.usuarioId, this.usuario).subscribe(
      (response) => {
        this.registroExitoso = true;
        this.registroFallido = false;
        this.usuarioModificado.emit(this.usuario);
        setTimeout(() => {
          this.registroExitoso = false;
          this.close();
        }, 3000);
      },
      (error) => {
        console.error('Error al actualizar usuario:', error);
        this.registroFallido = true;
        this.registroExitoso = false;
        setTimeout(() => {
          this.registroFallido = false;
        }, 3000);
      }
    );
  }
  usuarioId!: number;
  open(id: number) {
    this.mostrar = true;
    this.usuarioId = id;
    this.obtener();
  }
  obtener() {
    this.servicio.obtenerUsuarioPorId2(this.usuarioId).subscribe(
      (usuario: Usuario2) => {
        this.usuario = usuario;
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }
}

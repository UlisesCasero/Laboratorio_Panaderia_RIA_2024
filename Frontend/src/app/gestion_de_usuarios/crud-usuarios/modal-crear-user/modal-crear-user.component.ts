import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/models/usuario';
import { ServiciosService } from 'src/services/servicios.service';

@Component({
  selector: 'app-modal-crear-user',
  templateUrl: './modal-crear-user.component.html',
  styleUrls: ['./modal-crear-user.component.scss'],
})
export class ModalCrearUserComponent {
  mostrar: boolean = false;
  usuario: Usuario = {
    id: 0,
    email: '',
    telefono: '',
    role: '',
    enabled: true,
  };
  registroExitoso: boolean = false;
  registroFallido: boolean = false;
  existeUsuario: boolean = false;
  mensajeError: string = '';

  @ViewChild('usuarioForm') usuarioForm!: NgForm;
  @Output() insumoAgregado = new EventEmitter<{ usuario: Usuario }>();

  constructor(private servicioService: ServiciosService) {}

  ngOnInit(): void {}

  registro(form: NgForm) {
    if (form.valid) {
      const telefono = form.value.Telefono;
      const correo = form.value.Correo;
      const contraseña = form.value.Contraseña;
      const role = form.value.rol;
      const registroData = {
        email: correo,
        password: contraseña,
        telefono: telefono,
        role: 'USER',
      };
      this.servicioService.registro(registroData).subscribe(
        (response) => {
          if (response.userExists) {
            this.existeUsuario = true;
            setTimeout(() => {
              this.registroFallido = true;
              this.close();
            }, 4000);
          } else {
            (this.registroExitoso = true),
              this.insumoAgregado.emit({ usuario: response });
            setTimeout(() => {
              this.close();
              form.resetForm();
            }, 4000);
          }
        },
        (error) => {
          setTimeout(() => {
            this.registroFallido = true;
          }, 3000);
        }
      );
    }
  }

  open(): void {
    this.mostrar = true;
  }

  close(): void {
    this.mostrar = false;
  }

  actualizarUsuario() {
    this.servicioService
      .actualizarUsuario(this.usuario.id, this.usuario)
      .subscribe(
        (response) => {
          this.registroExitoso = true;
          this.registroFallido = false;
          this.insumoAgregado.emit({ usuario: response });
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
}

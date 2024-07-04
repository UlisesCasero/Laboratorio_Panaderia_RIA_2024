import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/models/usuario';
import { ServiciosService } from 'src/services/servicios.service';

@Component({
  selector: 'app-modal-crear-user',
  templateUrl: './modal-crear-user.component.html',
  styleUrls: ['./modal-crear-user.component.scss']
})
export class ModalCrearUserComponent {
  mostrar: boolean = false;
  usuario: Usuario = {
    id: 0,
    email: '',
    telefono: '',
    role: '',
    enabled: true
  };
  registroExitoso: boolean = false;
  registroFallido: boolean = false;
  @ViewChild('usuarioForm') usuarioForm!: NgForm;
  @Output() insumoAgregado = new EventEmitter<{ usuario: Usuario }>();

  constructor(private servicioService: ServiciosService) { }

  ngOnInit(): void { }
mensaje: string ='';
mensajeError: string= '';
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
        role: 'USER'
      };
      this.servicioService.registro2(registroData).subscribe(
        (response) => {
          this.mensaje = 'Registro Exitoso';
          setTimeout(() => {
            this.mensaje = '';
            this.close();
          }, 4000);
          this.insumoAgregado.emit({ usuario: response });
          setTimeout(() => {
          }, 4000);
        },
        (error) => {
          console.error('Error del servidor:', error);
          this.mensajeError = error.error.message || 'Error desconocido';
          setTimeout(() => {
            this.mensajeError = '';
            this.close();
          }, 4000);
        }
      );
      this.registroExitoso = false;
      this.registroFallido = false;
    }
  }

  open(): void {
    this.mostrar = true;
  }

  close(): void {
    this.mostrar = false;
  }

  actualizarUsuario() {
    this.servicioService.actualizarUsuario(this.usuario.id,this.usuario).subscribe(
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

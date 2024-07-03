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
      this.servicioService.registro(registroData).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          this.registroExitoso = true;
        },
        error => {
          setTimeout(() => {
            this.registroFallido = true;
          }, 4000);
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
}

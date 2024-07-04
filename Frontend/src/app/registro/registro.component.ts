import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/services/servicios.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  registroExitoso: boolean = false;
  registroFallido: boolean = false;
  existeUsuario: boolean = false;
  verReseteo: boolean = false;
  mensajeError: string = '';

  constructor(private router: Router, private servicioService: ServiciosService) { }


  registro(form: NgForm) {
    if (form.valid) {
      const telefono = form.value.Telefono;
      const correo = form.value.Correo;
      const contraseña = form.value.Contraseña;

      const registroData = {
        email: correo,
        password: contraseña,
        telefono: telefono,
        role: 'USER'
      };
      this.servicioService.registro(registroData).subscribe(
        response => {
          if (response.userExists) {
            this.existeUsuario = true;
            this.mensajeError = response.message || 'Mail ingresado en uso.';
            setTimeout(() => {
              this.registroFallido = false;
            }, 4000);
          } else {
            this.registroExitoso = true;
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 4000);
          }
        },
        error => {
          console.error('Error en el registro:', error);
          this.registroFallido = true;
          this.mensajeError = error.error.message || 'Ocurrió un error en el registro.';
          setTimeout(() => {
            this.registroFallido = false;
          }, 4000);
        }
      );
    }
  }
}

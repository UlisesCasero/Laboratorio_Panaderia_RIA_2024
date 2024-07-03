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
          console.log('Respuesta del servidor:', response);
          this.registroExitoso = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error => {
          setTimeout(() => {
            this.registroFallido = true;
          }, 4000);
        }
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosService } from 'src/services/servicios.service';
//import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss']
})
export class CambiarPasswordComponent implements OnInit {
  cambioExitoso = false;
  cambioFallido = false;
  hashedPassword!: string; // Propiedad para almacenar el password hasheado
  id!: number; // Propiedad para almacenar el id como number

  constructor(
    private route: ActivatedRoute,
    private authService: ServiciosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener id y password desde la URL
    this.route.queryParams.subscribe(params => {
      this.id = +params['id'];
      this.hashedPassword = params['psw']; 
    });
  }

  submitForm(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement | null;
    if (!form) {
      return;
    }

    const newPasswordInput = form.elements.namedItem('Contraseña') as HTMLInputElement | null;
   // bcrypt.hash(this.hashedPassword, 10, (err, hashedPassword) => {
   
     //  console.error('Error al hashear la contraseña:', hashedPassword);
   // });
    if (newPasswordInput) {
      const newPassword = newPasswordInput.value;

     
          console.log('La contraseña ingresada coincide con la contraseña hasheada desde la URL');
          console.log('Contraseña ingresada:', newPassword);
          console.log('Contraseña hasheada desde la URL:', this.hashedPassword);

          this.cambioPassword(this.id, this.hashedPassword, newPassword);
    }
  }

  cambioPassword(id: number, oldPassword: string, newPassword: string) {
    console.log('Enviando solicitud de cambio de contraseña para el usuario con ID:', id);
    console.log('Contraseña anterior (hasheada):', oldPassword);
    console.log('Nueva contraseña:', newPassword);

    this.authService.cambioPassword({ id, oldPassword, newPassword }).subscribe(
      (response) => {
        console.log('Contraseña cambiada correctamente:', response);
        this.cambioExitoso = true;
        setTimeout(() => {
          this.cambioExitoso = false;
          this.router.navigate(['/login']);
        }, 4000);
      },
      (error) => {
        console.error('Error al cambiar contraseña:', error);
        this.cambioFallido = true;
  
        setTimeout(() => {
          this.cambioFallido = false;
        }, 4000);
      }
    );
  }
}

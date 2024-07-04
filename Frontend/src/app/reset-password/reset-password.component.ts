import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/services/servicios.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  mandoEmailExitoso = false;
  mandoEmailFallido = false;

  constructor(private authService: ServiciosService, private router: Router) {}

  submitForm(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement | null;
    if (!form) {
      return;
    }

    const emailInput = form.elements.namedItem(
      'email'
    ) as HTMLInputElement | null;

    if (emailInput) {
      const email = emailInput.value;

      this.authService.obtenerUsuarioPorEmail(email).subscribe(
        (usuario) => {
          this.reset(usuario.email);
        },
        (error) => {
          console.error('Error al buscar usuario por email:', error);
        }
      );
    }
  }

  reset(email: string): void {
    this.authService.reset({ email }).subscribe(
      (response) => {
        this.mandoEmailExitoso = true;

        setTimeout(() => {
          this.mandoEmailExitoso = false;
          this.router.navigate(['/login']);
        }, 4000);
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
        this.mandoEmailFallido = true;

        setTimeout(() => {
          this.mandoEmailFallido = false;
        }, 4000);
      }
    );
  }
}

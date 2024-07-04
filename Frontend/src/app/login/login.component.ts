import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginExitoso = false;
  loginFallido = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(email: string, password: string): void {
    this.authService.login({ email, password }).subscribe(
      (response) => {
        const nombre = response.nombre;
        const role = response.role;

        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('rol', role);
        localStorage.setItem('token', response.token);

        this.loginExitoso = true;
        setTimeout(() => {
          this.loginExitoso = false;
        }, 4000);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
        this.loginFallido = true;
        setTimeout(() => {
          this.loginFallido = false;
        }, 4000);
      }
    );
  }

  loginExitoso2(): void {
    this.loginExitoso = true;
    this.router.navigate(['/']);
  }

  loginFallido2(): void {
    this.loginFallido = true;
    this.router.navigate(['/']);
  }

  submitForm(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement | null;
    if (!form) {
      return;
    }

    const emailInput = form.elements.namedItem(
      'email'
    ) as HTMLInputElement | null;
    const passwordInput = form.elements.namedItem(
      'password'
    ) as HTMLInputElement | null;

    if (emailInput && passwordInput) {
      const email = emailInput.value;
      const password = passwordInput.value;

      this.login(email, password);
    }
  }
}

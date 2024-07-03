import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Laboratorio_Panaderia_Ria';
  @ViewChild(LoginComponent)
  loginComponent!: LoginComponent;

  constructor(private router: Router) { }

  get loggedUserName(): string | null {
    const nombre = localStorage.getItem('nombre');
    return nombre;
  }


  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }

  redirectToLoginForm() {
    this.router.navigate(['/login']);
  }

  redirectToRegisterForm() {
    this.router.navigate(['/registro']);
  }

  isRootRoute(): boolean {
    return this.router.url === '/';
  }
}

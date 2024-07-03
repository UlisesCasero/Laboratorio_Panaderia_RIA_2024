import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from 'src/app/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
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
    this.router.navigate(['/usuarios/registro']);
  }

  isRootRoute(): boolean {
    return this.router.url === '/';
  }
}

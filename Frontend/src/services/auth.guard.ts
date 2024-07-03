import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    // Verifica si hay un token en el localStorage
    const token = localStorage.getItem('token');

    // Si hay un token, devuelve true (el usuario está autenticado)
    if (token) {
      return true;
    }

    // Si no hay token, redirige al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);

    // Devuelve false ya que el usuario no está autenticado
    return false;
  }
}

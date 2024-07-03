import { Component } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent {

  isAdmin(): boolean {
    const role = localStorage.getItem('rol');
    return role === 'ADMIN';
  }

  isUser(): boolean {
    const role = localStorage.getItem('rol');
    return role === 'USER';
  }

  isPanadero(): boolean {
    const role = localStorage.getItem('rol');
    return role === 'PANADERO';
  }
}

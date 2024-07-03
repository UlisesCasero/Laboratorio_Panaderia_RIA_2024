import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServiciosService } from 'src/services/servicios.service';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.scss']
})
export class PerfilClienteComponent implements OnInit {
  usuario = {
    email: '',
    telefono: '',
    password: '',
  };
  newTelefono: string = '';
  userId: number | undefined;
  private usuarioSubscription: Subscription | undefined;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  notification = { message: '', type: '' };

  constructor(private router: Router, private serviciosService: ServiciosService) {

  }

  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');

    if (userIdString) {
      this.userId = parseInt(userIdString, 10);
      console.log(this.userId);
    } else {
      console.error('No se encontró userId en el localStorage o es null/undefined.');
    }

    if (this.userId !== undefined) {
      this.obtenerUsuarioPorId(this.userId);
    }
  }

  obtenerUsuarioPorId(userId: number): void {
    this.serviciosService.obtenerUsuarioPorId().subscribe(
      (response: any) => {
        this.usuario.email = response.email;
        this.usuario.telefono = response.telefono;
        console.log('fdsfsfsf', response);
      },
      (error: any) => {
        console.error('Error al obtener usuario por ID:', error);
      }
    );
  }
  ngOnDestroy(): void {
    if (this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
  }

  filterNumberInput(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  openChangePasswordModal() {
    document.getElementById('changePasswordModal')?.classList.remove('hidden');
  }

  closeChangePasswordModal() {
    document.getElementById('changePasswordModal')?.classList.add('hidden');
  }

  openChangeTelefonoModal() {
    this.newTelefono = this.usuario.telefono;
    document.getElementById('changeTelefonoModal')?.classList.remove('hidden');
  }

  closeChangeTelefonoModal() {
    this.newTelefono = '';
    document.getElementById('changeTelefonoModal')?.classList.add('hidden');
  }

  submitChangeTelefono() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.usuario.telefono = this.newTelefono;
      setTimeout(() => {
        this.usuario.telefono = this.newTelefono;
        this.notification = { message: 'Teléfono actualizado correctamente', type: 'bg-green-500 text-white' };
        this.closeChangeTelefonoModal();
      }, 1000);
      this.clearNotification();
      this.serviciosService.actualizarUsuario(Number(this.userId), this.usuario).subscribe(
        response => {
          console.log('Usuario actualizado correctamente:', response);
        },
        error => {
          console.error('Error al actualizar usuario:', error);
        }
      );
    }
    this.closeChangeTelefonoModal();
  }

  submitChangePassword() {
    if (this.newPassword === this.confirmPassword) {
      setTimeout(() => {
        this.notification = { message: 'Contraseña actualizada correctamente', type: 'bg-green-500 text-white' };
        this.closeChangePasswordModal();
      }, 1000);
    } else {
      this.notification = { message: 'Las contraseñas no coinciden', type: 'bg-red-500 text-white' };
    }
    this.clearNotification();

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.usuario.password = this.newPassword;
      this.serviciosService.actualizarUsuario(Number(userId), this.usuario).subscribe(
        response => {
          console.log('Usuario actualizado correctamente:', response);
        },
        error => {
          console.error('Error al actualizar usuario:', error);
          setTimeout(() => {
            this.logout();
          }, 4000);
        }
      );
    }

    this.closeChangePasswordModal();
  }
  private clearNotification() {
    setTimeout(() => {
      this.notification = { message: '', type: '' };
    }, 5000);
  }
  logout() {

    setTimeout(() => {
      console.log('Usuario ha cerrado sesión');
      this.notification = { message: 'Sesión cerrada correctamente', type: 'bg-green-500 text-white' };
    }, 4000);
    this.clearNotification();
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
  }
}

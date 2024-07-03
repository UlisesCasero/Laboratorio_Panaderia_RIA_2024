import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Insumo } from 'src/models/insumo';
import { ProductoService } from 'src/services/producto.service';

@Component({
  selector: 'app-modal-modificar',
  templateUrl: './modal-modificar.component.html',
  styleUrls: ['./modal-modificar.component.scss']
})
export class ModalModificarComponent {
  constructor(private productoSVC: ProductoService) { }
  isVisible = false;
  mostrar: boolean = false;
  insumo!: Insumo;
  nombreInsumo: string = '';
  registroExitoso: boolean = false;
  registroFallido: boolean = false;

  @Output() closed = new EventEmitter<void>();
  @Output() insumoModificado = new EventEmitter<Insumo>();

  serverBaseUrl = 'http://localhost:3000/uploads/';

  open(producto: Insumo) {
    this.insumo = producto; // Asigna el insumo recibido
    this.nombreInsumo = producto.nombre; // Asigna el nombre del insumo al input
    this.mostrar = true; 
    this.isVisible = true;
  }

  close(): void {
    this.mostrar = false;
  }
  modificarInsumo(): void {
    this.insumo.nombre = this.nombreInsumo;
    this.productoSVC.putInsumo(this.insumo.id, this.insumo).subscribe({
      next: (data) => {
        console.log('Insumo modificado:', data);
        this.registroExitoso = true;
        setTimeout(() => {
          this.close();
        }, 4000);
        this.insumoModificado.emit(this.insumo); 
      },
      error: (error) => {
        setTimeout(() => {
          this.registroFallido = true;
          this.close();
        }, 4000);
      }
    });
  }
}

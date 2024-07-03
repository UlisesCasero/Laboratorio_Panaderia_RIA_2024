import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-crear-insumo',
  templateUrl: './crear-insumo.component.html',
  styleUrls: ['./crear-insumo.component.scss']
})
export class CrearInsumoComponent {
  isVisible = false;

  @Output() closed = new EventEmitter<void>();

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
    this.closed.emit();
  }
}

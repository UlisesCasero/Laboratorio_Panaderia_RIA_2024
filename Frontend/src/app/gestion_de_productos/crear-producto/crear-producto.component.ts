import { Component, ElementRef, Renderer2, ViewChild, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss']
})
export class CrearProductoComponent {
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

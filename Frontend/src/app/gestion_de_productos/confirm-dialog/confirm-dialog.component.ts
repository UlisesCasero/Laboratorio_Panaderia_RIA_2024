import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  @Input() insumoSeleccionado: { id: number, nombre: string } | null = null;
  @Output() confirmarEliminarInsumo = new EventEmitter<void>();
  @Output() cerrarModalConfirmacion = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmarEliminarInsumo.emit();
  }

  onCancel(): void {
    this.cerrarModalConfirmacion.emit();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Insumo, InsumoP } from 'src/models/insumo';
import { ProductoService } from 'src/services/producto.service';

@Component({
  selector: 'app-insumos-modal',
  templateUrl: './insumos-modal.component.html',
  styleUrls: ['./insumos-modal.component.scss']
})
export class InsumosModalComponent implements OnInit {
  mostrar: boolean = false;
  insumos: Insumo[] = [];

  @Output() insumoAgregado = new EventEmitter<{ insumo: InsumoP, cantidad: number }>();

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.obtenerInsumos();
  }

  open(): void {
    this.mostrar = true;
  }

  close(): void {
    this.mostrar = false;
  }
  
  obtenerInsumos(): void {
    this.productoService.getInsumoss().subscribe(
      (insumos: Insumo[]) => {
        this.insumos = insumos;
      },
      error => {
        console.error('Error al obtener los insumos', error);
      }
    );
  }

  agregarInsumo(insumo: Insumo, cantidad: string): void {
    const cantidadNumber = parseInt(cantidad, 10);
    console.log('ID del insumo:', insumo.id);
    console.log('Cantidad ingresada:', cantidadNumber);
    this.insumoAgregado.emit({ insumo, cantidad: cantidadNumber });
    this.insumos = this.insumos.filter(i => i !== insumo);
  }
}

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
  mostrarMje: boolean = false;
  mostrarMje2: boolean = false;
  @Output() insumoAgregado = new EventEmitter<{ insumo: InsumoP, cantidad: number }>();

  constructor(private productoService: ProductoService) { }

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
    if (cantidad == '') {
      this.mostrarMje = true;
      setTimeout(() => {
        this.mostrarMje = false;
      }, 3000);
     
      return;
    }
    const cantidadNumber = parseInt(cantidad, 10);
    this.mostrarMje2 = true;
    setTimeout(() => {
      this.mostrarMje2 = false;
    }, 3000);
    this.insumoAgregado.emit({ insumo, cantidad: cantidadNumber });
    this.insumos = this.insumos.filter(i => i !== insumo);
    this.mostrarMje = false;
  }
}

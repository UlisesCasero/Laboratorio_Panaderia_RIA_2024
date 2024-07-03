import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrdenCompra } from 'src/models/ordenCompra';
import { OrdenCompraService } from 'src/services/orden-compra.service';
import { estadoOrden } from 'src/enums/estado-orden';
import { OrdenVista } from 'src/models/ordenVistaPanadero';
import { ModalDetalleClienteComponent } from '../modal-detalle-cliente/modal-detalle-cliente.component';

@Component({
  selector: 'app-ordenes-cliente',
  templateUrl: './ordenes-cliente.component.html',
  styleUrls: ['./ordenes-cliente.component.scss']
})
export class OrdenesClienteComponent implements OnInit {
  public misOrdenes: OrdenCompra[] = [];
  public pageSize: number = 5; 
  public currentPage: number = 1; 
  public totalItems: number = 0; 

  constructor(private oredenesSVC: OrdenCompraService, private router: Router) {}

  ngOnInit(): void {
    this.getOrdenesCliente();
  }

  getOrdenesCliente(){
    const id = Number(localStorage.getItem('userId'));

    this.oredenesSVC.getOrdenCompraByCienteId(id).subscribe({
      next: (data) => {
        this.misOrdenes = data;
        this.totalItems = this.misOrdenes.length;
        this.filteredOrdenes = this.misOrdenes;
      },
      error: (error) => {
        console.error('Error al cargar ordenes:', error);
      }
    });
  }

  verDetalle(id: number){
    this.router.navigate(['/pedidosOrden',id]);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrdenes.length / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize - 1, this.filteredOrdenes.length - 1);
  }

  get paginatedOrdenes(): OrdenCompra[] {
    return this.filteredOrdenes.slice(this.startIndex, this.endIndex + 1);
  }


  onPageChange(page: number) {
    this.currentPage = page;
    // Puedes implementar lógica adicional aquí, como cargar las órdenes de la página específica
  }
  ordenAscendente: boolean = true;
  ordenarPorFecha() {
    if (this.misOrdenes) {
      this.filteredOrdenes.sort((a, b) => {
        if (this.ordenAscendente) {
          return new Date(a.fecha_entrega).getTime() - new Date(b.fecha_entrega).getTime();
        } else {
          return new Date(b.fecha_entrega).getTime() - new Date(a.fecha_entrega).getTime();
        }
      });
      this.ordenAscendente = !this.ordenAscendente;
    }
  }
  applyEstadoFilter() {
    this.selectedEstado === 'Todos';
    if (this.selectedEstado === 'Todos') {
      this.filteredOrdenes = this.misOrdenes;
    } else {
      this.filteredOrdenes = this.misOrdenes.filter(
        (orden) => orden.estado === this.selectedEstado
      );
    }
    this.currentPage = 1;
  }
  filteredOrdenes: OrdenCompra[] = [];
  selectedEstado: string = 'Todos';
  estados: string[] = ['Listo para recoger', 'Pendiente', 'En preparación'];
  
  @ViewChild('modificarProductoModal') modificarProductoModal!: ModalDetalleClienteComponent;
  openModalModificacion(id: number) {
    this.modificarProductoModal.open(id);
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleInsumosTotalesComponent } from './modal-detalle-insumos-totales.component';

describe('ModalDetalleInsumosTotalesComponent', () => {
  let component: ModalDetalleInsumosTotalesComponent;
  let fixture: ComponentFixture<ModalDetalleInsumosTotalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetalleInsumosTotalesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleInsumosTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

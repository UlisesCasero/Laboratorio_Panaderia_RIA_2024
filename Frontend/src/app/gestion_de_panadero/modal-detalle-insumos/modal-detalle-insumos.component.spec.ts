import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleInsumosComponent } from './modal-detalle-insumos.component';

describe('ModalDetalleInsumosComponent', () => {
  let component: ModalDetalleInsumosComponent;
  let fixture: ComponentFixture<ModalDetalleInsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetalleInsumosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

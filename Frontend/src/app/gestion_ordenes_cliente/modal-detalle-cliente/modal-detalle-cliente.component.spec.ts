import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleClienteComponent } from './modal-detalle-cliente.component';

describe('ModalDetalleClienteComponent', () => {
  let component: ModalDetalleClienteComponent;
  let fixture: ComponentFixture<ModalDetalleClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetalleClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

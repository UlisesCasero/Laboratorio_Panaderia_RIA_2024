import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleOrdenComponent } from './modal-detalle-orden.component';

describe('ModalDetalleOrdenComponent', () => {
  let component: ModalDetalleOrdenComponent;
  let fixture: ComponentFixture<ModalDetalleOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetalleOrdenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

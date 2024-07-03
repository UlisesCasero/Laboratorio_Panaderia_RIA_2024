import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOrdenesDetallesComponent } from './modal-ordenes-detalles.component';

describe('ModalOrdenesDetallesComponent', () => {
  let component: ModalOrdenesDetallesComponent;
  let fixture: ComponentFixture<ModalOrdenesDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalOrdenesDetallesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalOrdenesDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

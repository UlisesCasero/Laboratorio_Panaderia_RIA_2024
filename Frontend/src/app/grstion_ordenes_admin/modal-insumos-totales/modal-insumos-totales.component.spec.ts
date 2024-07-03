import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsumosTotalesComponent } from './modal-insumos-totales.component';

describe('ModalInsumosTotalesComponent', () => {
  let component: ModalInsumosTotalesComponent;
  let fixture: ComponentFixture<ModalInsumosTotalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInsumosTotalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInsumosTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

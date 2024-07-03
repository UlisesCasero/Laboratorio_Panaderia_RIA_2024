import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosTotalesAdminModalComponent } from './insumos-totales-admin-modal.component';

describe('InsumosTotalesAdminModalComponent', () => {
  let component: InsumosTotalesAdminModalComponent;
  let fixture: ComponentFixture<InsumosTotalesAdminModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsumosTotalesAdminModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosTotalesAdminModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

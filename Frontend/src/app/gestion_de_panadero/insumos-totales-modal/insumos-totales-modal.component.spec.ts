import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosTotalesModalComponent } from './insumos-totales-modal.component';

describe('InsumosTotalesModalComponent', () => {
  let component: InsumosTotalesModalComponent;
  let fixture: ComponentFixture<InsumosTotalesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsumosTotalesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosTotalesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

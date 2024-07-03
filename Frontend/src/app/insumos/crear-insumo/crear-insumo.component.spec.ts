import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearInsumoComponent } from './crear-insumo.component';

describe('CrearInsumoComponent', () => {
  let component: CrearInsumoComponent;
  let fixture: ComponentFixture<CrearInsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearInsumoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

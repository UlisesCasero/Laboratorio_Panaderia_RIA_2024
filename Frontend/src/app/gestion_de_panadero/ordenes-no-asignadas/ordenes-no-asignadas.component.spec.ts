import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesNoAsignadasComponent } from './ordenes-no-asignadas.component';

describe('OrdenesNoAsignadasComponent', () => {
  let component: OrdenesNoAsignadasComponent;
  let fixture: ComponentFixture<OrdenesNoAsignadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesNoAsignadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesNoAsignadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

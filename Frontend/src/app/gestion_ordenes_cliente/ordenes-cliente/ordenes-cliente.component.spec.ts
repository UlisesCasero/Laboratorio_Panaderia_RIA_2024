import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesClienteComponent } from './ordenes-cliente.component';

describe('OrdenesClienteComponent', () => {
  let component: OrdenesClienteComponent;
  let fixture: ComponentFixture<OrdenesClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

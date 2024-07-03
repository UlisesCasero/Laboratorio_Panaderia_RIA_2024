import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesClienteModalComponent } from './ordenes-cliente-modal.component';

describe('OrdenesClienteModalComponent', () => {
  let component: OrdenesClienteModalComponent;
  let fixture: ComponentFixture<OrdenesClienteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesClienteModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesClienteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

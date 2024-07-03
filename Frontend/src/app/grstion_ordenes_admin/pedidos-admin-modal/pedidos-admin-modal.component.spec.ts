import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosAdminModalComponent } from './pedidos-admin-modal.component';

describe('PedidosAdminModalComponent', () => {
  let component: PedidosAdminModalComponent;
  let fixture: ComponentFixture<PedidosAdminModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosAdminModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosAdminModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

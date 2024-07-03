import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosOrdenModalComponent } from './pedidos-orden-modal.component';

describe('PedidosOrdenModalComponent', () => {
  let component: PedidosOrdenModalComponent;
  let fixture: ComponentFixture<PedidosOrdenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosOrdenModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosOrdenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

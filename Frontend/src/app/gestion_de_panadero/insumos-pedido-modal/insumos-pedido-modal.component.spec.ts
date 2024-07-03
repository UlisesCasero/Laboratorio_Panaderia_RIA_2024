import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosPedidoModalComponent } from './insumos-pedido-modal.component';

describe('InsumosPedidoModalComponent', () => {
  let component: InsumosPedidoModalComponent;
  let fixture: ComponentFixture<InsumosPedidoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsumosPedidoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosPedidoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

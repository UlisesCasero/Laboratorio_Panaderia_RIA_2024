import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalModificarComponent } from './modal-modificar.component';

describe('ModalModificarComponent', () => {
  let component: ModalModificarComponent;
  let fixture: ComponentFixture<ModalModificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalModificarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalModificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

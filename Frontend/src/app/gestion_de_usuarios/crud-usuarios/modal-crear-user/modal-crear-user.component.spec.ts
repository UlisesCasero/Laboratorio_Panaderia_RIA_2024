import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearUserComponent } from './modal-crear-user.component';

describe('ModalCrearUserComponent', () => {
  let component: ModalCrearUserComponent;
  let fixture: ComponentFixture<ModalCrearUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCrearUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

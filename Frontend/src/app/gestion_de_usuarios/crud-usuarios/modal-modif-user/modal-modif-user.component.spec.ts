import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalModifUserComponent } from './modal-modif-user.component';

describe('ModalModifUserComponent', () => {
  let component: ModalModifUserComponent;
  let fixture: ComponentFixture<ModalModifUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalModifUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalModifUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

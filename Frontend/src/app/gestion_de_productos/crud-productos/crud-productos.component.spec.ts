import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDProductosComponent } from './crud-productos.component';

describe('CRUDProductosComponent', () => {
  let component: CRUDProductosComponent;
  let fixture: ComponentFixture<CRUDProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRUDProductosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRUDProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

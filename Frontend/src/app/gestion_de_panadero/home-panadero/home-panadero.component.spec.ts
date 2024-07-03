import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePanaderoComponent } from './home-panadero.component';

describe('HomePanaderoComponent', () => {
  let component: HomePanaderoComponent;
  let fixture: ComponentFixture<HomePanaderoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePanaderoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePanaderoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

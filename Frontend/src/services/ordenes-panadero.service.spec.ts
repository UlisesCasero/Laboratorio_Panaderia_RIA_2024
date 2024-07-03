import { TestBed } from '@angular/core/testing';

import { OrdenesPanaderoService } from './ordenes-panadero.service';

describe('OrdenesPanaderoService', () => {
  let service: OrdenesPanaderoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenesPanaderoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OrdenesAdminService } from './ordenes-admin.service';

describe('OrdenesAdminService', () => {
  let service: OrdenesAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenesAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

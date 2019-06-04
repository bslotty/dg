import { TestBed, inject } from '@angular/core/testing';

import { PermissionBackend } from './backend.service';

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionBackend]
    });
  });

  it('should be created', inject([PermissionBackend], (service: PermissionBackend) => {
    expect(service).toBeTruthy();
  }));
});

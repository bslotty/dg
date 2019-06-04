import { TestBed, inject } from '@angular/core/testing';

import { AccountBackend } from './backend.service';

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountBackend]
    });
  });

  it('should be created', inject([AccountBackend], (service: AccountBackend) => {
    expect(service).toBeTruthy();
  }));
});

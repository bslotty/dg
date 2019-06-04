import { TestBed, inject } from '@angular/core/testing';

import { SessionBackend } from './backend.service';

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionBackend]
    });
  });

  it('should be created', inject([SessionBackend], (service: SessionBackend) => {
    expect(service).toBeTruthy();
  }));
});

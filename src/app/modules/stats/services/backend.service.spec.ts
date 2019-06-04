import { TestBed, inject } from '@angular/core/testing';

import { StatsBackend } from './backend.service';

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatsBackend]
    });
  });

  it('should be created', inject([StatsBackend], (service: StatsBackend) => {
    expect(service).toBeTruthy();
  }));
});

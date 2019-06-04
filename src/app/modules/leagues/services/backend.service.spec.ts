import { TestBed, inject } from '@angular/core/testing';

import { LeagueBackend } from './backend.service';

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeagueBackend]
    });
  });

  it('should be created', inject([LeagueBackend], (service: LeagueBackend) => {
    expect(service).toBeTruthy();
  }));
});

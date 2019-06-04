import { TestBed, inject } from '@angular/core/testing';

import { LeagueGuard } from './league.service';

describe('LeagueGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeagueGuard]
    });
  });

  it('should be created', inject([LeagueGuard], (service: LeagueGuard) => {
    expect(service).toBeTruthy();
  }));
});

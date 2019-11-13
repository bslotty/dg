import { TestBed, async, inject } from '@angular/core/testing';

import { SessionAdminGuard } from './session-admin.guard';

describe('SessionAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionAdminGuard]
    });
  });

  it('should ...', inject([SessionAdminGuard], (guard: SessionAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});

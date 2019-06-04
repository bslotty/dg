import { TestBed, inject } from '@angular/core/testing';

import { LoadGuard } from './load.service';

describe('LoadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadGuard]
    });
  });

  it('should be created', inject([LoadGuard], (service: LoadGuard) => {
    expect(service).toBeTruthy();
  }));
});

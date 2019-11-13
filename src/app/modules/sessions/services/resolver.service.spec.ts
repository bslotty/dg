import { TestBed } from '@angular/core/testing';

import { SessionResolverService } from './resolver.service';

describe('ResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionResolverService = TestBed.get(SessionResolverService);
    expect(service).toBeTruthy();
  });
});

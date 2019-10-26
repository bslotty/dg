import { TestBed } from '@angular/core/testing';

import { SessionFormService } from './form.service';

describe('FormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionFormService = TestBed.get(SessionFormService);
    expect(service).toBeTruthy();
  });
});

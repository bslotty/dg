import { TestBed } from '@angular/core/testing';

import { ScoresFormService } from './scores-form.service';

describe('ScoresFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScoresFormService = TestBed.get(ScoresFormService);
    expect(service).toBeTruthy();
  });
});

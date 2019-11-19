import { TestBed } from '@angular/core/testing';

import { ScoresBackend } from './backend.service';

describe('ScoresBackend', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScoresBackend = TestBed.get(ScoresBackend);
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { CourseBackend } from './backend.service';

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseBackend]
    });
  });

  it('should be created', inject([CourseBackend], (service: CourseBackend) => {
    expect(service).toBeTruthy();
  }));
});

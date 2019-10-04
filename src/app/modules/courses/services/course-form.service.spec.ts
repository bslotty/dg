import { TestBed } from '@angular/core/testing';

import { CourseFormService } from './course-form.service';

describe('CourseFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CourseFormService = TestBed.get(CourseFormService);
    expect(service).toBeTruthy();
  });
});

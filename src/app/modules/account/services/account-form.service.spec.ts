import { TestBed } from '@angular/core/testing';

import { AccountFormService } from './account-form.service';

describe('AccountFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountFormService = TestBed.get(AccountFormService);
    expect(service).toBeTruthy();
  });
});

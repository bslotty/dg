import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTempUsersComponent } from './create-temp-users.component';

describe('CreateTempUsersComponent', () => {
  let component: CreateTempUsersComponent;
  let fixture: ComponentFixture<CreateTempUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTempUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTempUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

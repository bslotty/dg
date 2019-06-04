import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeTempUsersComponent } from './merge-temp-users.component';

describe('MergeTempUsersComponent', () => {
  let component: MergeTempUsersComponent;
  let fixture: ComponentFixture<MergeTempUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeTempUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeTempUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

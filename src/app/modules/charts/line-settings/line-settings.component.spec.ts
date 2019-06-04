import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineSettingsComponent } from './line-settings.component';

describe('LineSettingsComponent', () => {
  let component: LineSettingsComponent;
  let fixture: ComponentFixture<LineSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

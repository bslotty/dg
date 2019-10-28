import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFormatComponent } from './select-format.component';

describe('FormatDetailsComponent', () => {
  let component: SelectFormatComponent;
  let fixture: ComponentFixture<SelectFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from 'src/app/modules/sessions/components/select-course/node_modules/@angular/core/testing';

import { SelectCourseComponent } from './select-course.component';

describe('CourseSelectorComponent', () => {
  let component: SelectCourseComponent;
  let fixture: ComponentFixture<SelectCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

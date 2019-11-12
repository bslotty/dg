import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CourseBackend, Course } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { flyInPanelRow } from 'src/app/animations';
import { CourseFormService } from '../../services/course-form.service';

@Component({
  selector: 'app-course-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [flyInPanelRow]
})
export class SearchComponent implements OnInit {

  form: FormGroup;
  results: Course[] = null;

  @Input() selectedCourse: Course;
  @Output() selected: EventEmitter<Course> = new EventEmitter();

  @Input() header: boolean = true;

  constructor(
    private courses: CourseBackend,
    private coursesForm: CourseFormService,
    private feed: FeedbackService,
  ) { }


  ngOnInit() {

    //  Setup Form
    this.coursesForm.Setup('search');
    this.coursesForm.form$.subscribe((f) => {
      this.form = f;
    });

    //  Listen to Course List Changes
    this.courses.list$.subscribe((c) => {
      this.feed.loading = false;
      this.results = c;
    });

    /*
    //  Display Loader upon change; No delay
    this.form.get('search').valueChanges.subscribe((s) => {
      if (this.form.valid) {
        this.feed.loading = true;
      } else {
        this.feed.loading = false;
      }
    });
    */
  }

  selectCourse($event) {
    this.selected.emit($event);
    this.form.reset();
    this.results = null;
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CourseBackend, Course } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { CourseFormService } from '../../services/course-form.service';
import { flyIn, flyLeft } from 'src/app/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-course-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [flyIn, flyLeft]
})
export class SearchComponent implements OnInit {

  form: FormGroup;
  results: Observable<Course[]>;

  @Input() header: boolean = true;

  constructor(
    private courses: CourseBackend,
    private coursesForm: CourseFormService,
    private feed: FeedbackService,
  ) { }


  ngOnInit() {

    //  Setup Form
    this.coursesForm.Setup('search');
    this.coursesForm.form$.subscribe((f)=>{
      this.form = f;
    });

    //  Listen to Course List Changes
    this.results = this.courses.list$;

  }
}

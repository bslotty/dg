import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CourseBackend, Course } from '../../services/backend.service';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { CourseFormService } from '../../services/course-form.service';
import { flyIn } from 'src/app/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'course-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [flyIn]
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
    this.results = this.courses.search$;

  }
}

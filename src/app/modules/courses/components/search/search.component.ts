import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CourseBackend, Course } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { flyInPanelRow } from 'src/app/animations';

@Component({
  selector: 'app-course-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [flyInPanelRow]
})
export class SearchComponent implements OnInit {

  form: FormGroup;
  results: Course[] = null;

  @Input() mode: string = "selector"; //  Link, Favorite,

  @Input() selectedCourse: Course;
  @Output() selected: EventEmitter<Course> = new EventEmitter();

  constructor(
    private builder: FormBuilder,
    private courses: CourseBackend,
    private feed: FeedbackService,
  ) { }

  ngOnInit() {

    //  Setup Form
    this.form = this.builder.group({
      "term": ["", [Validators.required, Validators.minLength(3)]]
    });

    //  Listen to Course List Changes
    this.courses.list$.subscribe((c) => {
      this.feed.loading = false;
      this.results = c;
    });



    //  Search upon form change; with delay
    this.form.valueChanges.pipe(this.courses.serverPipe).subscribe((c) => {
      if (this.form.valid) {
        this.courses.search(c["term"]);
        this.feed.loading = true;
      }
    });


    //  Display Loader upon change; No delay
    this.form.get('term').valueChanges.subscribe((s) => {
      console.log("update; ", this.form, s );
      if (this.form.valid) {
        this.feed.loading = true;
      } else {
        this.feed.loading = false;
      }
    });
  }




  setCourse(course) {
    this.selected.emit(course);
  }
}

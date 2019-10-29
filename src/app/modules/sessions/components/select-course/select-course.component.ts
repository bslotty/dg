import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseBackend, Course } from 'src/app/modules/courses/services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { SessionFormService } from '../../services/form.service';

@Component({
  selector: 'app-select-course',
  templateUrl: './select-course.component.html',
  styleUrls: ['./select-course.component.scss']
})
export class SelectCourseComponent implements OnInit {
  
  form: FormGroup;
  results:Course[] = [];
  @Output() selected: EventEmitter<Course> = new EventEmitter();


  constructor(
    private courses: CourseBackend,
    private feed: FeedbackService,
    private builder: FormBuilder,

  ) { }

  ngOnInit() {
    this.form = this.builder.group({
      term: ["", [Validators.required]],
    });

    //  Listen to Course List Changes
    this.courses.list$.subscribe((c)=>{
      this.feed.loading = false;
      this.results = c;
    });



    
    //  Search upon form change; with delay
    this.form.valueChanges.pipe(this.courses.serverPipe).subscribe((c)=>{
      console.log (c);
      this.courses.search(c["term"]);
    });


    //  Display Loader upon change; No delay
    this.form.get('term').valueChanges.subscribe((s)=>{
      this.feed.loading = true;
    });
  }

  setCourse(course) {
    this.selected.emit(course);
  }
}


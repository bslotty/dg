import { Component, OnInit, Input } from '@angular/core';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { Course } from '../../../services/backend.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-course-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [],
})
export class ListComponent implements OnInit {

  @Input() title: string;
  @Input() courseList: Course[];
  mode: string;
  
  form: FormGroup;
  courses: any;
  results: any;


  constructor(
    private feed: FeedbackService,
    private builder: FormBuilder,
  ) { }

  ngOnInit() {
    if (this.mode == "search") {
      this.initSearchExtras();
    }

  }

  trackCourse(index, item) {
    return item.id;
  }

 
  initSearchExtras() { /*
    //  Setup Form
    this.form = this.builder.group({
      "term": ["", [Validators.required, Validators.minLength(3)]]
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
      console.log("update; ", this.form, s);
      if (this.form.valid) {
        this.feed.loading = true;
      } else {
        this.feed.loading = false;
      }
    });
  */}

}




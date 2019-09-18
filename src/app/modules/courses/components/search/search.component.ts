import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CourseBackend } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  form: FormGroup;
  results = [];

  constructor(
    private builder: FormBuilder,
    private courses: CourseBackend,
    private feed: FeedbackService,
  ) { }

  ngOnInit() {

    //  Setup Form
    this.form = this.builder.group({
      "term": ["", [Validators.required, Validators.minLength(2)]]
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

}

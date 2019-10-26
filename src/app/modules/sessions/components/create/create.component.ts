import { loading } from 'src/app/animations';
import { ServerPayload } from 'src/app/app.component';
import { FeedbackService } from './../../../feedback/services/feedback.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, } from '@angular/core';
import { Location } from '@angular/common';

import { CourseBackend, Course } from '../../../courses/services/backend.service';
import { LeagueBackend, League } from '../../../leagues/services/backend.service';
import { AccountBackend } from '../../../account/services/backend.service';
import { SessionBackend, Session } from '../../services/backend.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [loading]
})
export class CreateComponent implements OnInit {

  form: FormGroup;
  courseList: Course[];
  insertID: string;

  session: Session = new Session();

  constructor(
    public courses: CourseBackend,
    public account: AccountBackend,
    public sessions: SessionBackend,
    public builder: FormBuilder,
    public location: Location,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.feed.initiateLoading();
    this.initForm();
    this.getCourseList();
  }


  initForm() {

    //  Set Today as default for convience
    var d = new Date();

    //  Set Start
    //  this.form.get('start').setValue(new Date(+(this.session.start + "000")));

    //  Set Time
    var d = new Date();
    var hour = d.getHours() > 12 ? (d.getHours() - 12) : d.getHours();
    var min = d.getMinutes();
    
    if (min < 14 && min >= 0) {
      min = 15;
    } else if (min < 29 && min >= 15) {
      min = 30;
    } else if (min < 44 && min >= 30) {
      min = 45;
    } else if (min >= 45) {
      min = 0;
      hour = hour > 12 ? hour + 1 : 1;
    }

    var ampm = d.getHours() > 12 ? "pm" : "am";

    this.form = this.builder.group({
      course: ["", Validators.required],
      start: [d, Validators.required],
      hour: [hour.toString(), Validators.required],
      min: [min.toString(), Validators.required],
      ampm: [ampm, Validators.required],
      description: [""],
    });
  }


  getCourseList() {
    /*  Broken when adding multiple course lists. Fix when working through a new session
    this.courses.getList('').subscribe((v: Course[]) => {

      this.courseList = v;
      this.feed.finializeLoading();
    });
    */
  }

  onFormSubmit() {
    if (this.form.valid && this.form.dirty) {

      this.feed.initiateLoading();

      //  Convert Date
      var d: Date = new Date(this.form.get('start').value);
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();

      var hour = this.form.get('hour').value;
      var min = this.form.get('min').value;
      var convert = this.form.get('ampm').value.toLowerCase()

      //  AM/PM Fix
      if (convert == 'pm' && hour != '12') {
        hour = (+hour + 12);
      } else if (convert == 'am' && hour == '12') {
        hour = "00";
      }

      //  Set Start Date
      var d = new Date(year, month, day, hour, min);

      //  Create Session
      var session: Session = new Session(
        null,
        this.form.get('course').value,
        "ffa",
        d,
        this.form.get('description').value
      );

      //  Send Request
      /*
      this.sessions.createSession(session).subscribe((res: ServerPayload) => {
        this.feed.finializeLoading(res, true);
        if (res['status'] == 'success') { }

      });
      */
    }

  }

}

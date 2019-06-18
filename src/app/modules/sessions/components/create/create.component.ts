import { loading } from 'src/app/animations';
import { ServerPayload } from 'src/app/app.component';
import { FeedbackService } from './../../../feedback/services/feedback.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';

import { CourseBackend, Course } from '../../../courses/services/backend.service';
import { LeagueBackend, League } from '../../../leagues/services/backend.service';
import { AccountBackend } from '../../../account/services/backend.service';
import { SessionBackend, Session } from '../../services/backend.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [loading]
})
export class CreateComponent implements OnInit {

  public form: FormGroup;
  public courseList: Course[];
  public insertID: string;

  public league: League = new League (this.data.league.id);

  headerButtons = [{
    icon: "icon-x",
    color: "transparent-primary",
    action: "close",
  }];

  constructor(
    public courses: CourseBackend, 
    public leagues: LeagueBackend,
    public account: AccountBackend,
    public sessions: SessionBackend,
    public builder: FormBuilder,
    public location: Location,
    public feed: FeedbackService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<CreateComponent>,
  ) { }

  ngOnInit() {
    this.feed.initiateLoading();
    this.initForm();
    this.getCourseList();
  }

  actionClick($event) {
    if ($event == "close"){ 
      this.close();
    }
  }

  initForm() {
    this.form = this.builder.group({
      course: ["", Validators.required],
      start: ["", Validators.required],
      hour: ["", Validators.required],
      min: ["", Validators.required],
      ampm: ["", Validators.required],
      description: [""],
    }); 
  }


  getCourseList() {
    this.courses.getList('asc').subscribe((v:Course[])=>{

      this.courseList = v;
      this.feed.finializeLoading();
    });
  }

  onFormSubmit(){
    if (this.form.valid && this.form.dirty) {

      this.feed.initiateLoading();

      //  Convert Date
      var d:Date = new Date(this.form.get('start').value);
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
      this.sessions.createSession(this.league, session).subscribe((res: ServerPayload)=>{
        this.feed.finializeLoading(res, true);
        if (res['status'] == 'success') {

          //  Goto Session; No Need for extra action. Yay Lazy!
          //  this.router.navigate(["leagues", this.league.id, "sessions", res["insertID"]])
          this.close(true);
        }

      });
    }
    
  }

  locationBack(){
    this.location.back();
  }

  close(res = false) {
    this.dialog.close(res);
  }

}

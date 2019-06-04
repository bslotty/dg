import { loading } from 'src/app/animations';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { ServerPayload } from 'src/app/app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';

import { CourseBackend, Course } from '../../../courses/services/backend.service';
import { LeagueBackend, League } from '../../../leagues/services/backend.service';
import { AccountBackend } from '../../../account/services/backend.service';
import { SessionBackend, Session } from '../../services/backend.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  animations: [loading]
})
export class EditComponent implements OnInit {


  public form: FormGroup;
  public courseList: Course[];
  public insertID: string;
  public deleteConfirm: boolean = false;

  public league: League = new League (this.data.league.id);
  public session: Session = new Session (this.data.session.id);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<EditComponent>,
    public courses: CourseBackend, 
    public leagues: LeagueBackend,
    public account: AccountBackend,
    public sessions: SessionBackend,
    public builder: FormBuilder,
    public location: Location,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    console.log ("League: ", this.league);
    console.log ("Session: ", this.session);

    this.feed.initiateLoading();
    this.initForm();
    this.getCourseList();
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

    this.setForm();
  }

  getCourseList() {
    this.courses.getList('asc').subscribe((v:Course[])=>{
      this.courseList = v;
    });
  }

  setForm() {
    this.sessions.getDetail(this.session).subscribe((v:Session)=>{
      this.session = v;

      //  Set Course & Desc
      this.form.get('course').setValue(this.session.course.id);
      this.form.get('description').setValue(this.session.description);
      
      //  Set Start
      this.form.get('start').setValue(new Date( +(this.session.start + "000") ));
      
      //  Set Time
      var d = new Date( +(this.session.start + "000") );
      var hour = d.getHours() > 12 ? (d.getHours() - 12) : d.getHours();
      this.form.get('hour').setValue(hour.toString());
      this.form.get('min').setValue(d.getMinutes() == 0 ? "00" : d.getMinutes().toString());
      this.form.get('ampm').setValue( d.getHours() > 12 ? "pm" : "am" );

      this.feed.finializeLoading();
    });
  }


  toggleDelete(){
    this.deleteConfirm = !this.deleteConfirm;
  }
  

  deleteSession() {
    this.feed.initiateLoading();

    this.sessions.delete(this.league, this.session).subscribe((res:ServerPayload)=>{
      this.feed.finializeLoading(res, true);
      
      if (res.status == "success") {
        //  this.router.navigate(["leagues", this.league.id]);
      }
    })
  }


  updateSession(){
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
        this.session.id, 
        new Course(this.form.get('course').value), 
        "ffa",
        d, 
        this.form.get('description').value
      );

      //  Send Request
      this.sessions.updateSession(this.league, session).subscribe((res: ServerPayload)=>{
        if (res['status'] == 'success') {
          this.feed.finializeLoading(res, true);

          //  Goto Session; No Need for extra action. Yay Lazy!
          //  this.router.navigate(["leagues", this.league.id, "sessions", this.session.id])
          this.closeForm();
        }
      });
    }
  }

  locationBack(){
    this.location.back();
  }

  closeForm() {
    this.dialog.close(this.session);
  }

}
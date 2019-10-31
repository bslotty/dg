import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CourseBackend, Course } from '../../courses/services/backend.service';
import { Router } from '@angular/router';
import { Session, SessionBackend } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class SessionFormService {

  private form: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
  form$: Observable<FormGroup> = this.form.asObservable();

  builder: FormBuilder = new FormBuilder;

  initialized: boolean = false;

  /*
  public starts_on?: Date,
  public title?: string,
  public par?: Array<any>,
  public players?: Player[],
  */

  //  Form Field Control Setup;
  private cFormat = new FormControl("", [
    Validators.required
  ]);

  private cCourse = new FormControl("", [
    Validators.required,
  ]);

  private cDate = new FormControl("", [
    Validators.required,
  ]);

  private cTime = new FormControl("", [
    Validators.required,
  ]);

  private cPlayers = new FormControl([], [
    Validators.required,
  ]);

  private cTerm = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(128)
  ]);

  /*
  private cTitle = new FormControl("", [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(10)
  ]);
  */

  constructor(
    private courseService: CourseBackend,
    private sessionService: SessionBackend,
    private router: Router) { }

  Setup(type) {

    var form = this.builder.group({});

    switch (type) {
      case "create":
        form.addControl("format", this.cFormat);
        form.addControl("course", this.cCourse);
        form.addControl("date", this.cDate);
        form.addControl("time", this.cTime);
        form.addControl("players", this.cPlayers);
        break;

      case "edit":
        form.addControl("format", this.cFormat);
        form.addControl("course", this.cCourse);
        form.addControl("date", this.cDate);
        form.addControl("time", this.cTime);
        form.addControl("players", this.cPlayers);
        break;

      case "search":
        form.addControl("term", this.cTerm);

        //  Listen to Changes for Date Time Merge
        form.valueChanges.subscribe((v) => {
          //  console.log ("form.valueChanges.v: ", v);

          if (v.time != "" && v.date instanceof Date && v.date.getHours() == 0) {
            var d = new Date(v.date.toDateString() + " " + v.time);
            console.log("date set: ", d);
            this.setDate(d);
          }
        });
        break;
    }


    this.form.next(form);
  }

  /**
  *  @returns boolean
  *  Form needs to be Valid, Touched, and not Disabled.
  */
  ReadyForSubmission(): boolean {
    if (this.form.value.valid && this.form.value.dirty && !this.form.value.disabled) {
      return true;
    } else {
      return false;
    }
  }

  resetForm(): void {
    this.form.value.get("format").reset();
    this.form.value.get("course").reset();
    this.form.value.get("date").reset();
    this.form.value.get("time").reset();
    this.form.value.get("players").reset();
  }

  setForm(values): void {
    this.form.value.get("format").setValue(values.cFormat);
    this.form.value.get("course").setValue(values.cCourse);
    this.form.value.get("date").setValue(values.cDate);
    this.form.value.get("time").setValue(values.cTime);
    this.form.value.get("players").setValue(values.cPlayers);
    this.form.value.markAsDirty();

  }

  setFormat(format) {
    console.log("setFormat", format);
    this.form.value.get("format").setValue(format);
  }

  setCourse(course) {
    console.log("setCourse", course);
    this.form.value.get("course").setValue(course);
  }

  setDate(date) {
    this.form.value.get("date").setValue(date);
  }

  addPlayer(player) {

    var dupe = false;
    this.form.value.get("players").value.forEach((v, i) => {
      if (v.id == player.id) {
        dupe = true;
      }
    });

    if (!dupe) {
      this.form.value.get('players').value.push(player);
    }
  }

  removePlayer(player) {
    this.form.value.get("players").value.forEach((v, i) => {
      if (v.id == player.id) {
        this.form.value.get('players').value.splice(i, 1);
      }
    });
  }



  SubmitCreation() {
    console.log("SubmitCreation.form: ", this.form);

    //  Append Date + Time;

    var session = new Session();
    session.format = this.form.value.value.cFormat;
    session.course = this.form.value.value.cCourse;
    session.starts_on = this.form.value.value.cDate;
    session.players = this.form.value.value.cPlayers;

    this.sessionService.create(session).subscribe((res) => {
      console.log("course.form.create.res: ", res);
      if (this.courseService.rCheck(res)) {
        var createdCourse = this.courseService.rGetData(res);
        this.router.navigate(["courses", createdCourse[0]['id']]);
      } else {
        console.log("Nearby?");

        //  Fix
        this.courseService.setCourseList(this.courseService.rGetData(res) as Course[]);

        this.router.navigate(["courses/nearby"]);
      }
    });



    //  Old

    /*
        if (this.form.valid && this.form.dirty) {


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
      this.sessions.createSession(session).subscribe((res: ServerPayload) => {
        this.feed.finializeLoading(res, true);
        if (res['status'] == 'success') { }

      });
    }
  */
  }

















}

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

  private cPlayers = new FormControl("", [
    Validators.required,
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
        form.addControl("players", this.cPlayers);
        break;

      case "edit":
        form.addControl("format", this.cFormat);
        form.addControl("course", this.cCourse);
        form.addControl("date", this.cDate);
        form.addControl("players", this.cPlayers);
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
    this.form.value.get("players").reset();
  }

  setForm(values): void {
    this.form.value.get("format").setValue(values.cFormat);
    this.form.value.get("course").setValue(values.cCourse);
    this.form.value.get("date").setValue(values.cDate);
    this.form.value.get("players").setValue(values.cPlayers);
    this.form.value.markAsDirty();

  }

  SubmitCreation() {
    console.log("SubmitCreation.form: ", this.form);

    var session         = new Session();
    session.format      = this.form.value.value.cFormat;
    session.course      = this.form.value.value.cCourse;
    session.starts_on   = this.form.value.value.cDate;
    session.players     = this.form.value.value.cPlayers;

    this.sessionService.create(session).subscribe((res) => {
      console.log("course.form.create.res: ", res);
      if (this.courseService.rCheck(res)) {
          var createdCourse = this.courseService.rGetData(res);
          this.router.navigate(["courses", createdCourse[0]['id']]);
      } else {
        console.log ("Nearby?");
        
        //  Fix
        this.courseService.setCourseList(this.courseService.rGetData(res) as Course[]);

        this.router.navigate(["courses/nearby"]);
      }
    });
  }

















}

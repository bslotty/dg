import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CourseBackend } from '../../courses/services/backend.service';
import { Router } from '@angular/router';
import { SessionBackend } from './backend.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AccountBackend } from '../../account/services/backend.service';
import { ScoresBackend } from '../../scores/services/backend.service';

@Injectable({
  providedIn: 'root'
})
export class SessionFormService {

  private form: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
  form$: Observable<FormGroup> = this.form.asObservable();

  builder: FormBuilder = new FormBuilder;

  private cDate = new FormControl("", {
    updateOn: "blur", validators: [
      Validators.required,
      //  Validators.pattern("(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)")
    ]
  });

  private cTime = new FormControl("", {
    updateOn: "blur", validators: [
      Validators.required,
      //  Validators.pattern("((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))")
    ]
  });



  private cTerm = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(128)
  ]);


  constructor(
    private helper: HelperService,
    private session_: SessionBackend,
    private router: Router) {

    //  Get Data & Populate
    this.session_.detail$.subscribe((s) => {
      this.setForm(s);
    });
  }


  Setup(type) {
    var form = this.builder.group({});

    switch (type) {
      case "create":
        form.addControl("date", this.cDate);
        form.addControl("time", this.cTime);
        break;

      case "edit":
        form.addControl("date", this.cDate);
        form.addControl("time", this.cTime);
        break;

      case "search":
        form.addControl("", this.cTerm);
        break;

    }


    //  Push Initial Form
    this.form.next(form);
  }


  resetForm(): void {
    if (this.form.value != undefined) {
      this.form.value.get("date").reset();
      this.form.value.get("time").reset();
    }
  }


  setForm(values): void {
    //  Date/Time
    if (values.starts_on != undefined) {
      this.setDate(values.starts_on);
    }
  }


  setDate(date: Date): void {
    var date = new Date(date);
    this.form.value.get("date").setValue(date);
    this.form.value.get("time").setValue(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(":00 ", " "));
  }


  /*

    TODO: FormControl Validators
  */
  validateDate(): void {
    this.form.value.get("date").updateValueAndValidity();
    this.form.value.get("time").updateValueAndValidity();
  }





}

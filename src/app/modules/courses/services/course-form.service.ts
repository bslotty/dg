import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CourseFormService {

  private form: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
  form$: Observable<FormGroup> = this.form.asObservable();

  builder: FormBuilder = new FormBuilder;


  //  Form Field Control Setup;
  private cParkName = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(128)
  ]);

  private cCity = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(60)
  ]);

  private cState = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50)
  ]);

  private cZip = new FormControl("", [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(10)
  ]);

  private cLat = new FormControl("", [
    Validators.required,
    Validators.minLength(9),
    Validators.maxLength(9)
  ]);

  private cLng = new FormControl("", [
    Validators.required,
    Validators.minLength(9),
    Validators.maxLength(9)
  ]);

  constructor() { }

  Setup(type) {

    var form = this.builder.group({});

    switch (type) {
      case "create":
        form.addControl("parkName", this.cParkName);
        form.addControl("city", this.cCity);
        form.addControl("state", this.cState);
        form.addControl("zip", this.cZip);
        form.addControl("lat", this.cLat);
        form.addControl("lng", this.cLng);
        break;

      case "edit":
        form.addControl("parkName", this.cParkName);
        form.addControl("city", this.cCity);
        form.addControl("state", this.cState);
        form.addControl("zip", this.cZip);
        form.addControl("lat", this.cLat);
        form.addControl("lng", this.cLng);
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

  SubmitCreation() {
    console.log("SubmitCreation.form: ", this.form);
  }


}

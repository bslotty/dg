import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CourseBackend } from './backend.service';
import { Router } from '@angular/router';
import { FeedbackService } from '../../../shared/modules/feedback/services/feedback.service';
import { Course, ServerPayload } from 'src/app/shared/types';
import { HelperService } from 'src/app/shared/services/helper.service';

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
    /* Validators.required, */
    Validators.minLength(9),
    Validators.maxLength(9)
  ]);

  private cLng = new FormControl("", [
    /* Validators.required, */
    Validators.minLength(9),
    Validators.maxLength(9)
  ]);

  private cTerm = new FormControl("", [
    Validators.required,
    Validators.minLength(2)
  ]);

  constructor(
    private courseService: CourseBackend,
    private router: Router,
    private feed: FeedbackService,
    private helper: HelperService,
  ) { }

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

      case "search":
        form.addControl('search', this.cTerm);

        //  Listen to Input changes to trigger loading and search
        form.get("search").valueChanges.pipe(this.helper.pipe).subscribe((s) => {
          if (form.valid) {
            this.feed.stopLoading("courseSearch");
            this.courseService.getSearch(s as string);
          }
        });

        //  Turn off Loader when Results populate
        this.courseService.search$.subscribe((s) => {
          this.feed.stopLoading("register");
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
    this.form.value.get("parkName").reset();
    this.form.value.get("city").reset();
    this.form.value.get("state").reset();
    this.form.value.get("zip").reset();
    this.form.value.get("lat").reset();
    this.form.value.get("lng").reset();
  }

  setForm(values): void {
    this.form.value.get("parkName").setValue(values.parkName);
    this.form.value.get("city").setValue(values.city);
    this.form.value.get("state").setValue(values.state);
    this.form.value.get("zip").setValue(values.zip);
    this.form.value.get("lat").setValue(values.lat);
    this.form.value.get("lng").setValue(values.lng);
    this.form.value.markAsDirty();
  }

  resetSearch() {
    this.form.value.get("search").reset();
  }

  SubmitCreation() {
    console.log("SubmitCreation.form: ", this.form);

    var course = new Course();
    course.park_name = this.form.value.value.parkName;
    course.city = this.form.value.value.city;
    course.state = this.form.value.value.state;
    course.zip = this.form.value.value.zip;
    course.latitude = this.form.value.value.lat;
    course.longitude = this.form.value.value.lng;

    this.courseService.create(course).subscribe((res: ServerPayload[]) => {
      console.log("course.form.create.res: ", res);
      if (this.helper.rCheck(res)) {
        var createdCourse = this.helper.rGetData(res);
        this.router.navigate(["courses", createdCourse[0]['id']]);
      } else {
        console.log("Nearby?");

        //  Fix
        this.courseService.setCourseList(this.helper.rGetData(res) as Course[]);

        this.router.navigate(["courses/nearby"]);
      }
    });
  }

















}

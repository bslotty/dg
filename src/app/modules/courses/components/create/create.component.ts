import { Component, OnInit } from '@angular/core';
import { CourseBackend, Course } from '../../services/backend.service';
import { CourseFormService } from '../../services/course-form.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  mode: string;     //  
  form: FormGroup;

  invalidParkAddress: Boolean = false;
  selectedLocation: Course;

  errorMessage: string = "Google was unable to find a park at that location. Try to move the pin inside a park or to another location within the park.";

  constructor(private courseService: CourseBackend, private courseForm: CourseFormService) { }

  ngOnInit() {
    this.courseForm.Setup("create");
    this.courseForm.form$.subscribe((f)=>{
      this.form = f;
    });
  }

  updateAddress($event) {
    console.log ("Course.Location.Update", $event);
    if ($event == false) {
      this.invalidParkAddress = true;

      this.form.get("parkName").reset();
      this.form.get("city").reset();
      this.form.get("state").reset();
      this.form.get("zip").reset();
      this.form.get("lat").reset();
      this.form.get("lng").reset();

    } else {
      this.selectedLocation = $event;
      this.invalidParkAddress = false;

      this.form.get("parkName").setValue($event.parkName);
      this.form.get("city").setValue($event.city);
      this.form.get("state").setValue($event.state);
      this.form.get("zip").setValue($event.zip);
      this.form.get("lat").setValue($event.lat);
      this.form.get("lng").setValue($event.lng);
      this.form.markAsDirty();
    }
  
    console.log ("form: ", this.form);
  }

  createCourse() {
    if  (this.courseForm.ReadyForSubmission()) {
      this.courseForm.SubmitCreation();
    }
  }

}

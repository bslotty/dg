import { Component, OnInit } from '@angular/core';
import { CourseFormService } from '../../services/course-form.service';
import { FormGroup } from '@angular/forms';
import { Course } from 'src/app/shared/types';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  mode: string;
  form: FormGroup;

  invalidParkAddress: Boolean = false;
  selectedLocation: Course;

  errorMessage: string = "Google was unable to find a park at that location. Try to move the pin inside a park or to another location within the park.";

  constructor(private courseForm: CourseFormService) { }

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

      this.courseForm.resetForm();

    } else {
      this.selectedLocation = $event;
      this.invalidParkAddress = false;

      this.courseForm.setForm($event);
    }
  
    console.log ("form: ", this.form);
  }

  createCourse() {
    if  (this.courseForm.ReadyForSubmission()) {
      this.courseForm.SubmitCreation();
    }
  }

}


import { FormGroup } from '@angular/forms';
import { Component, OnInit, } from '@angular/core';

import { CourseBackend, Course } from '../../../courses/services/backend.service';
import { AccountBackend } from '../../../account/services/backend.service';
import { SessionBackend, Session } from '../../services/backend.service';
import { SessionFormService } from '../../services/form.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: []
})
export class CreateComponent implements OnInit {

  form: FormGroup;
  courseList: Course[];
  insertID: string;

  session: Session = new Session();

 
  courseValid:boolean = false;

  constructor(
    private courses: CourseBackend,
    private account: AccountBackend,
    private sessions: SessionBackend,
    private sessionForm: SessionFormService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getCourseList();
  }


  initForm() {
    
    this.sessionForm.Setup("create");
    this.sessionForm.form$.subscribe((f)=>{
      this.form = f;
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

  }


  selectFormat($event) {
    console.log ("format.selected: ", $event);
    this.sessionForm.setFormat($event);
  } 

  selectCourse($event){
    console.log ("course.selected: ", $event);
    this.sessionForm.setCourse($event);
  }

}

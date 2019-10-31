
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { SessionFormService } from '../../services/form.service';
import { MatStepper } from '@angular/material';
import { AccountFormService } from 'src/app/modules/account/services/account-form.service';
import { Player, AccountBackend } from 'src/app/modules/account/services/backend.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: []
})
export class CreateComponent implements OnInit {

  form: FormGroup;
  insertID: string;

  @ViewChild("stepper", {static: true}) stepper: MatStepper;

  

  constructor(
    private sessionForm: SessionFormService,
    private accountForm: AccountFormService,
    private accounts: AccountBackend,
  ) { }

  ngOnInit() {

    //  Setup Form
    this.sessionForm.Setup("create");
    this.sessionForm.form$.subscribe((f)=>{
      this.form = f;
    });
  }


  onFormSubmit() {  }


  selectFormat($event) {
    console.log ("format.selected: ", $event);
    this.sessionForm.setFormat($event);
    this.stepper.next();
  } 

  selectCourse($event){
    console.log ("course.selected: ", $event);
    this.sessionForm.setCourse($event);
    this.stepper.next();
  }

  setTime($event){
    console.log("timeSet", $event);
    this.stepper.next();
  }

  addPlayer($event) {
    console.log("addPlayer", $event);
    this.sessionForm.addPlayer($event);
  }

  removePlayer($event) {
    console.log("removePlayer", $event);
    this.sessionForm.removePlayer($event);
  } 

}

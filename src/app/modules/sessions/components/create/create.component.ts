
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
  searchForm: FormGroup;
  insertID: string;

  @ViewChild("stepper", {static: true}) stepper: MatStepper;

  searchedPlayers: Player[];

  constructor(
    private sessionForm: SessionFormService,
    private accountForm: AccountFormService,
    private accounts: AccountBackend,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getCourseList();

    //  Listen to Player List Updates
    this.accounts.searchedPlayers$.subscribe((p)=>{
      console.log ("SearchedPlayers: ", p);
      this.searchedPlayers = p;
    });

    
  }


  initForm() {
    
    this.sessionForm.Setup("create");
    this.sessionForm.form$.subscribe((f)=>{
      this.form = f;
    });

    this.accountForm.Setup("search");
    this.accountForm.form$.subscribe((s)=>{
      this.searchForm = s;

      //  Listen to Player Searches
      this.searchForm.valueChanges.subscribe((f)=>{
        console.log ("formUpdate: ", f);
        this.accounts.searchUsers(f['term']);
      });
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

}

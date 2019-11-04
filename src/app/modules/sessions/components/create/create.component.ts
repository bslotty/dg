
import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { SessionFormService } from '../../services/form.service';
import { MatStepper } from '@angular/material';
import { AccountFormService } from 'src/app/modules/account/services/account-form.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { SelectPlayersComponent } from '../select-players/select-players.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { flyInPanelRow } from 'src/app/animations';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [flyInPanelRow]
})
export class CreateComponent implements OnInit {

  form: FormGroup;
  insertID: string;

  @ViewChild("stepper", {static: true}) stepper: MatStepper;
  @ViewChild("playerSelect", {static: true}) playerSelect: SelectPlayersComponent;


  roster = [];

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
    this.sessionForm.setFormat($event);
    this.stepper.next();
  } 

  selectCourse($event){
    this.sessionForm.setCourse($event);
    this.stepper.next();
  }

  setTime($event){
    console.log("timeSet", $event);
    

    //  Fix for stepper.next not working
    this.playerSelect.focusSearch();
    this.stepper.next();
    
  }




  get scoreList() {
    return this.form.get("scores") as FormArray;
  }

  addScore($event) {
    console.log("addScore", $event);
    this.sessionForm.addScore($event);
    
  }

  removeScore($event) {
    console.log("removeScore", $event);
    this.sessionForm.removeScore($event);
  }

  trackScores(input, item) {
    return item.value.id;
  }



  get teamList() {
    return this.form.get("teams") as FormArray;
  }

  addTeam(){
    this.sessionForm.addTeam();
    if (this.scoreList.controls.length > 0 && this.roster.length == 0 ) {
      this.roster[0] = this.scoreList.value;
    } else if (this.roster.length < this.teamList.length){
      this.roster.push([]);
    }
  }

  removeTeam(team) {
    this.sessionForm.removeTeam(team);
  }

  trackTeamBy(index, item) {
    item.value.id;
  }


  
  getRoster(team) {
    var roster = this.scoreList.value.filter((s)=>{
      if (!s.team) {
        s.team = this.teamList.value[0];
      }
      return s.team.id == team.value.id;
    });
    return roster;
  }

  rosterDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}

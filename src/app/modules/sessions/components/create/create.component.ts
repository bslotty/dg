
import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { SessionFormService } from '../../services/form.service';
import { MatStepper } from '@angular/material';
import { AccountFormService } from 'src/app/modules/account/services/account-form.service';
import { Player, AccountBackend } from 'src/app/modules/account/services/backend.service';
import { SelectPlayersComponent } from '../select-players/select-players.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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




  get playerList() {
    return this.form.get("players") as FormArray;
  }

  addPlayer($event) {
    console.log("addPlayer", $event);
    this.sessionForm.addPlayer($event);
    
  }

  removePlayer($event) {
    console.log("removePlayer", $event);
    this.sessionForm.removePlayer($event);
  }
  
  openPlayerSettings(player) {
    console.log ("player.settings: ", player);
  } 




  get teamList() {
    return this.form.get("teams") as FormArray;
  }

  addTeam(){
    this.sessionForm.addTeam();
    if (this.playerList.controls.length > 0 && this.roster.length == 0 ) {
      this.roster[0] = this.playerList.value;
    } else if (this.roster.length < this.teamList.length){
      this.roster.push([]);
    }
  }

  removeTeam(team) {
    this.sessionForm.removeTeam(team);
  }

  changeTeamColor(team) {
    console.log ("changeTeamColor: ", team);
  }
  
  getRoster(team) {
    var teamIndex:number = 0;
    this.teamList.controls.forEach((v, i)=>{
      if (team.name == v.value.name) {
        teamIndex = i;
      }
    });
    console.log ("roster:", this.roster);
    return this.roster[teamIndex];
  }

  rosterDrop(event: CdkDragDrop<string[]>) {
    console.log (event);
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

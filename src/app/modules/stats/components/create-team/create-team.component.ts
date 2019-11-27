import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StatsBackend, Team } from '../../services/backend.service';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {

  form: FormGroup;
  colorList = [{
    name: "red",
    hex: "ad0000",
    available: true,
  }, {
    name: "blue",
    hex: "3052ff",
    available: true,
  }, {
    name: "green",
    hex: "30ff30",
    available: true,
  }, {
    name: "yellow",
    hex: "fcf22f",
    available: true,
  }, {
    name: "orange",
    hex: "fcad2e",
    available: true,
  }, {
    name: "purple",
    hex: "802efc",
    available: true,
  }, {
    name: "pink",
    hex: "fc2eea",
    available: true,
  }, {
    name: "white",
    hex: "FFFFFF",
    available: true,
  },];

  resolve: boolean = false;
  headerButtons = [{
    icon: "icon-x",
    action: "close",
    color: "transparent-primary",
  }];

  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<CreateTeamComponent>,
    public builder: FormBuilder,
    public stats: StatsBackend,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.populateData();
  }

  actionClick($event) {
    if ($event == "close"){ 
      this.close();
    }
  }

  populateData() {
    combineLatest(
      this.stats.getList(this.data.session),
      this.stats.getTeams(this.data.session)
    ).subscribe(([stats, teams])=>{

      //  Disable Already Selected Colors

      console.log ("createTeams: ", teams);
      teams.forEach((team)=>{
        this.colorList.forEach((color)=>{
          if (color.name == team.color) {
            color.available = false;
          }
        });
      });
      this.resolve = true;
    });
  }

  initForm() {
    this.form = this.builder.group({
      name: ["", Validators.required],
      color: ["", Validators.required],
    });
  }

  close () {
    this.dialog.close();
  }

  createTeam() {
    console.log ("createTeam!");

    if (this.form.valid && this.form.dirty) {
      var team = new Team(
        null,
        this.form.get('name').value,
        this.form.get('color').value,
      );

      this.stats.createTeam(this.data.league, this.data.session, team).subscribe((data)=>{
        console.log ("createTeam.Complete!", data);
        this.feed.finializeLoading(data, true);

        this.stats.update$.next(true);
        this.close();
      });
    }
  }

}

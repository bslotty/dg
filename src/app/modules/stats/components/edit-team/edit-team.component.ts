import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CreateTeamComponent } from '../create-team/create-team.component';
import { StatsBackend, Team } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css']
})
export class EditTeamComponent implements OnInit {

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

  resolve: Boolean = false;
  headerButtons = [{
    icon: "icon-x",
    action: "close",
    color: "transparent-primary",
  }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public builder: FormBuilder,
    public dialog: MatDialogRef<CreateTeamComponent>,
    public stats: StatsBackend,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.initForm();

    console.log("this.data.color:", this.data.team.color);
    this.populateData();
    this.findColor();
  }

  actionClick($event) {
    if ($event == "close"){ 
      this.close();
    }
  }

  findColor() {
    var color = this.colorList.filter((v, i) =>{
      return v.name == this.data.team.color;
    })[0];

    this.form.get('color').setValue(color);
  }

  populateData() {
    combineLatest(
      this.stats.getList(this.data.session),
      this.stats.getTeams(this.data.session)
    ).subscribe(([stats, teams]) => {

      //  Disable Already Selected Colors
      teams.forEach((team) => {
        this.colorList.forEach((color) => {
          if (color.name == team.color) {
            color.available = false;
          }
        });
      })
    });
  }

  initForm() {
    this.form = this.builder.group({
      name: ["", Validators.required],
      color: ["", Validators.required],
    });

    this.form.get("name").setValue(this.data.team.name);
    this.form.get('color').setValue(this.data.team.color);
  }

  close(data = null) {
    this.dialog.close(data);
  }

  updateTeam() {

    if (this.form.valid && this.form.dirty) {
      var team = new Team(
        this.data.team.id,
        this.form.get('name').value,
        this.form.get('color').value,
      );

      this.stats.updateTeam(this.data.league, this.data.session, team).subscribe((res) => {
        this.feed.finializeLoading(res, true);
        this.close(team);
      });
    }
  }
}

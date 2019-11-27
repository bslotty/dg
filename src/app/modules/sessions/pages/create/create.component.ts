
import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SessionFormService } from '../../services/form.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { flyIn, flyLeft } from 'src/app/animations';
import { Session, SessionBackend } from '../../services/backend.service';
import { MatDialog } from '@angular/material';
import { SelectCourseComponent } from '../../dialogs/select-course/select-course.component';
import { SelectFormatComponent } from '../../dialogs/select-format/select-format.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [flyIn, flyLeft]
})
export class CreateComponent implements OnInit {

  form: FormGroup;
  roster = [];

  session: Session = new Session();

  playerModes: string[] = ["admin", "short"];

  constructor(
    private sessionForm: SessionFormService,
    private sessions_: SessionBackend,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    //  Setup Form
    this.sessionForm.Setup("create");
    this.sessionForm.form$.subscribe((f) => {
      this.form = f;
    });

    this.sessions_.detail$.subscribe((s)=>{
      console.log ("sessions.create.detail: ", s);
    })
  }

  selectCourse() {
    this.dialog.open(SelectCourseComponent, { });
  }

  selectFormat() {
    this.dialog.open(SelectFormatComponent, { });
  }



  get scoreList() {
    return this.form.get("scores") as FormArray;
  }

  addScore($event) {
    this.sessionForm.addScore($event);
  }

  removeScore($event) {
    this.sessionForm.removeScore($event);
  }

  trackScores(input, item) {
    return item.value.id;
  }





  get teamList() {
    return this.form.get("teams") as FormArray;
  }



  trackTeamBy(index, item) {
    item.value.id;
  }

  addTeam() {
    this.sessionForm.addTeam();
  }



  getRoster(team) {
    var roster;
    if (team == null) {
      roster = this.scoreList.value.filter((s) => { return !s.team });
    } else {
      roster = this.scoreList.value.filter((s) => {
        if (s.team) {
          return s.team == team.value;
        }

      });
    }
    return roster;
  }

  rosterDrop(event: CdkDragDrop<string[]>) {

    //  Get Destination Color Name
    var teamDestName = event.container.id.toString().replace("team-", "");

    //  Get Team Object From Color Name
    var teamDest = this.teamList.value.filter((t) => {
      return t.color.name == teamDestName;
    });

    //  Update Player's Team
    this.scoreList.controls.forEach((s) => {
      if (event.item.data.player.id == s.value.player.id) {
        s.value.team = teamDest[0];
      }
    });
  }

}

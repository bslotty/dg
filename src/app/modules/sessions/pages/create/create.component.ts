
import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SessionFormService } from '../../services/form.service';
import { flyIn, flyLeft } from 'src/app/animations';
import { MatDialog } from '@angular/material';
import { SelectCourseComponent } from '../../dialogs/select-course/select-course.component';
import { SelectFormatComponent } from '../../dialogs/select-format/select-format.component';
import { SelectTimeComponent } from '../../dialogs/select-time/select-time.component';
import { SelectPlayersComponent } from '../../dialogs/select-players/select-players.component';
import { SessionBackend } from '../../services/backend.service';
import { ScoresBackend } from 'src/app/modules/scores/services/backend.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [flyIn, flyLeft]
})
export class CreateComponent implements OnInit {

  form: FormGroup;
  roster = [];



  constructor(
    private sessionForm: SessionFormService,
    private sessions_: SessionBackend,
    private scores_: ScoresBackend,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.sessions_.resetDetail();

    //  Setup Form
    this.sessionForm.Setup("create");
    this.sessionForm.form$.subscribe((f) => {
      this.form = f;
      console.log ("this.f", f);
    });
  }


  //  Popups to Set
  selectCourse() {
    this.dialog.open(SelectCourseComponent, {
      minWidth: "75vw",
    });
  }

  selectFormat() {
    this.dialog.open(SelectFormatComponent, {
      minWidth: "75vw",
    });
  }

  selectTime() {
    this.dialog.open(SelectTimeComponent, {

    });
  }

  selectPlayers() {
    this.dialog.open(SelectPlayersComponent, {
      minWidth: "75vw",
    });
  }

  addTeam() {
    this.scores_.addTeam();
  }
}

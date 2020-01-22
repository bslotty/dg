
import { Component, OnInit } from '@angular/core';
import { flyIn } from 'src/app/animations';
import { FormGroup } from '@angular/forms';
import { SessionFormService } from '../../services/form.service';
import { SessionBackend, Session } from '../../services/backend.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ScoresBackend } from 'src/app/modules/scores/services/backend.service';
import { MatDialog } from '@angular/material';
import { SelectCourseComponent } from '../../dialogs/select-course/select-course.component';
import { SelectFormatComponent } from '../../dialogs/select-format/select-format.component';
import { SelectTimeComponent } from '../../dialogs/select-time/select-time.component';
import { SelectPlayersComponent } from '../../dialogs/select-players/select-players.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [flyIn]
})
export class DetailComponent implements OnInit {

  session: Session = new Session();
  form: FormGroup;

  playerModes = ["full", "admin"];

  confirmDelete: boolean = false;
  
  constructor(
    private _sessionsForm: SessionFormService,
    private _sessions: SessionBackend,
    private _scores: ScoresBackend,
    private router: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    
    //  Setup Form
    this._sessionsForm.Setup("edit");
    this._sessionsForm.form$.subscribe((f)=>{
      this.form = f;
    });

    //  Populate Data for form
    this.session.id = this.router.snapshot.paramMap.get("session");
    this._sessions.getDetail(this.session);
    
  }

  //  Popups
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

  scoreAction($event) {
    console.log("scoreAction.$event: ", $event);
  }

  toggleDelete() {
    this.confirmDelete = !this.confirmDelete;
  }
}

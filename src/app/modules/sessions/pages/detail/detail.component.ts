
import { Component, OnInit } from '@angular/core';
import { flyIn } from 'src/app/animations';
import { FormGroup } from '@angular/forms';
import { SessionFormService } from '../../services/form.service';
import { SessionBackend } from '../../services/backend.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ScoresBackend } from 'src/app/modules/scores/services/backend.service';
import { MatDialog } from '@angular/material';
import { SelectCourseComponent } from '../../dialogs/select-course/select-course.component';
import { SelectFormatComponent } from '../../dialogs/select-format/select-format.component';
import { SelectTimeComponent } from '../../dialogs/select-time/select-time.component';
import { SelectPlayersComponent } from '../../dialogs/select-players/select-players.component';
import { Session } from 'src/app/shared/types';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [flyIn]
})
export class DetailComponent implements OnInit {

  session$: Observable<Session> = this._sessions.detail$;

  form: FormGroup;

  playerModes = ["full", "admin"];

  confirmDelete: boolean = false;

  constructor(
    private _sessionsForm: SessionFormService,
    private _sessions: SessionBackend,
    private _scores: ScoresBackend,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {

    //  Setup Form
    this._sessionsForm.Setup("edit");
    this._sessionsForm.form$.subscribe((f) => {
      this.form = f;
    });

    //  Populate Data for form
    /*
    this.session.id = this.route.snapshot.paramMap.get("session");
    console.log("sessionid:", this.session.id);
    this._sessions.getDetail(this.session);
    */
   let fetch = this.route.paramMap.pipe(switchMap((params: ParamMap) => {
    console.log("session.id", params.get("session"));

    this._sessions.findDetails(params.get("session"))
    return this._sessions.detail$;
  })).subscribe();


    //  Save if close response is true (data changed);
    this.dialog
  }

  //  Popups
  selectCourse() {
    var dialogRef = this.dialog.open(SelectCourseComponent, {
      minWidth: "75vw",
    });


    dialogRef.afterClosed().subscribe((d) => {
      console.log("dialog.closed: ", d);
    });
  }

  selectFormat() {
    var dialogRef = this.dialog.open(SelectFormatComponent, {
      minWidth: "75vw",
    });

    dialogRef.afterClosed().subscribe((d) => {
      console.log("dialog.closed: ", d);
    });
  }

  selectTime() {
    var dialogRef = this.dialog.open(SelectTimeComponent, {

    });

    dialogRef.afterClosed().subscribe((d) => {
      console.log("dialog.closed: ", d);
    });
  }

  selectPlayers() {
    var dialogRef = this.dialog.open(SelectPlayersComponent, {
      minWidth: "75vw",
    });

    dialogRef.afterClosed().subscribe((d) => {
      console.log("dialog.closed: ", d);
    });
  }

  scoreAction($event) {
    console.log("scoreAction.$event: ", $event);
  }

  toggleDelete() {
    this.confirmDelete = !this.confirmDelete;
  }
}

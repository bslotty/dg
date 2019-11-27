
import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SessionFormService } from '../../services/form.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { flyIn, flyLeft } from 'src/app/animations';
import { Session, SessionBackend } from '../../services/backend.service';
import { MatDialog } from '@angular/material';
import { SelectCourseComponent } from '../../dialogs/select-course/select-course.component';
import { SelectFormatComponent } from '../../dialogs/select-format/select-format.component';
import { SelectTimeComponent } from '../../dialogs/select-time/select-time.component';
import { SelectPlayersComponent } from '../../dialogs/select-players/select-players.component';

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


  //  Popups to Set
  selectCourse() {
    this.dialog.open(SelectCourseComponent, { });
  }

  selectFormat() {
    this.dialog.open(SelectFormatComponent, { });
  }

  selectTime() {
    this.dialog.open(SelectTimeComponent, { });
  }

  selectPlayers() {
    this.dialog.open(SelectPlayersComponent, { });
  }

  
}

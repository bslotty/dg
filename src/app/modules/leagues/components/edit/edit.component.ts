import { loading } from './../../../../animations';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeagueBackend, League } from '../../services/backend.service';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { ServerPayload } from 'src/app/app.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  animations: [loading]
})
export class EditComponent implements OnInit {

  form: FormGroup;
  league: League = this.data.league;
  resolve: boolean = false;

  headerButtons = [{
    action: "close",
    icon: "icon-x",
    color: "transparent-primary",
  }];

  visModes = ["public", "private"];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<EditComponent>,
    public builder: FormBuilder,
    public leagues: LeagueBackend,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.builder.group({
      name: ["", [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(128)
      ]],
      visibility: ["" , [
        Validators.required
      ]],
      description: [""],
      restrictions: [""],
    });

    this.setForm();
  }

  actionClick($event) {
    if ($event == "close") {
      this.close();
    }
  }


  changeVis(vis) {
    this.form.get("visibility").setValue(vis);
    this.form.markAsDirty();
  }


  setForm() {
    this.form.get('name').setValue(this.league.name);
    this.form.get('visibility').setValue(this.league.visibility);
    this.form.get('description').setValue(this.league.description);
    this.form.get('restrictions').setValue(this.league.restrictions);

    this.resolve = true;
  }

  onFormSubmit() {
    if (this.form.valid && this.form.dirty) {

      this.resolve = false;

      //  Store Data
      this.league.name = this.form.get('name').value;
      this.league.visibility = this.form.get('visibility').value;
      this.league.description = this.form.get('description').value;
      this.league.restrictions = this.form.get('restrictions').value;

      //  Send Data
      this.leagues.update(this.league).subscribe((res: ServerPayload) => {
        this.resolve = true;
        this.feed.finializeLoading(res, true);

        if (res.status == "success") {
          this.close();
        }
      });
    }
  }


  close () {
    this.dialog.close();
  }
}

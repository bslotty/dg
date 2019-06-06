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

  headerButtons = [{
    action: "close",
    icon: "icon-x",
    color: "transparent-primary",
  }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<EditComponent>,
    public builder: FormBuilder,
    public leagues: LeagueBackend,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.feed.initiateLoading();
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


  setForm() {
    console.log ("this.League: ", this.league);

    this.form.get('name').setValue(this.league.name);
    this.form.get('visibility').setValue(this.league.visibility == "public" ? true : false);
    this.form.get('description').setValue(this.league.description);
    this.form.get('restrictions').setValue(this.league.restrictions);

    this.feed.finializeLoading();
  }

  onFormSubmit() {
    if (this.form.valid && this.form.dirty) {

      this.feed.initiateLoading();

      //  Store Data
      this.league.name = this.form.get('name').value;
      this.league.visibility = this.form.get('visibility').value == true ? "public" : "private";
      this.league.description = this.form.get('description').value;
      this.league.restrictions = this.form.get('restrictions').value;

      //  Send Data
      this.leagues.update(this.league).subscribe((res: ServerPayload) => {
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

import { ServerPayload } from 'src/app/app.component';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeagueBackend, League } from '../../services/backend.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})

export class CreateComponent implements OnInit {

  public form: FormGroup;
  public league: League = new League("0");

  constructor(
    public builder: FormBuilder,
    public leagues: LeagueBackend,
    public router: Router,
    public location: Location,
    public feed: FeedbackService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<CreateComponent>,
  ) { }

  ngOnInit() {
    this.initForm();
  }


  initForm() {
    this.form = this.builder.group({
      name: ["", [
        Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(128)
      ]],
      visibility: [true , [
      ]],
      description: [""],
      restrictions: [""],
    });
  }

  onFormSubmit() {
    if (this.form.valid && this.form.dirty) {

      this.feed.initiateLoading();


      //  Store Data
      this.league.name = this.form.get('name').value;
      this.league.visibility = this.form.get('visibility').value == true ? "public" : "public";
      this.league.description = this.form.get('description').value;
      this.league.restrictions = this.form.get('restrictions').value;

      //  Send Data
      this.leagues.create(this.league).subscribe((res: ServerPayload) => {
        
        this.feed.finializeLoading(res, true);

        if (res.status == "success") {
          this.router.navigate(["leagues", res["insertID"]]);
          this.dialog.close();
        }
      });
    }
  }

  back() {
    this.location.back();
  }

  close(){
    this.dialog.close();
  }
}

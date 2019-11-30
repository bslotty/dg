import { Component, OnInit, Inject } from '@angular/core';
import { AccountFormService } from 'src/app/modules/account/services/account-form.service';
import { FormGroup } from '@angular/forms';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { flyInPanelRow, flyIn } from 'src/app/animations';
import { Score, Team } from 'src/app/modules/scores/services/backend.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-select-players',
  templateUrl: './select-players.component.html',
  styleUrls: ['./select-players.component.scss'],
  animations: [flyInPanelRow, flyIn],
})
export class SelectPlayersComponent implements OnInit {

  form: FormGroup;
  results: Score[] = [];
  playerMode: string[] = ["full","email","selector"];

  constructor(
    private accountForm: AccountFormService,
    private accounts: AccountBackend,
    private feed: FeedbackService,
    private dialogRef: MatDialogRef<SelectPlayersComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
  ) { }

  ngOnInit() {
    //  Setup Form
    this.accountForm.Setup("search");
    this.accountForm.form$.subscribe((f)=>{
      this.form = f;
    });

    //  Load Upon Type
    this.form.valueChanges.subscribe((v)=>{
      if (this.form.valid) {
        this.feed.loading = true;
      } 
     
    });

    //  Listen to Player List Updates
    this.accounts.searchedPlayers$.subscribe((p)=>{
      if (p != undefined) {

        this.results = p.map((v)=>{
          var s = new Score();
          s.player = v;
          s.handicap = 0;
          s.team = {id: null, name: null, color: {name: 'unassigned'}}
          return s;
        });
      }
      this.feed.loading = false;
    });
  }


  trackBy(index, item) {
    return item.id;
  }

  close () {
    this.dialogRef.close();
  }
}

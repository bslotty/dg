import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { AccountFormService } from 'src/app/modules/account/services/account-form.service';
import { FormGroup } from '@angular/forms';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { flyInPanelRow, flyIn } from 'src/app/animations';
import { Score } from '../../services/backend.service';


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

  @Output() selected: EventEmitter<Score> = new EventEmitter();

  @ViewChild("search", {static: true}) search;

  constructor(
    private accountForm: AccountFormService,
    private accounts: AccountBackend,
    private feed: FeedbackService,
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
        //  Verify new users arent already in

        this.results = p.map((v)=>{
          var s = new Score();
          s.player = v;
          s.handicap = 0;
          return s;
        });
      }
      this.feed.loading = false;
    });
  }

  include($event) {
    this.selected.emit($event.score);

    this.results.forEach((v, i) => {
      if (v.player.id == $event.score.player.id) {
        this.results.splice(i, 1);
      }
    });

  }

  trackBy(index, item) {
    return item.id;
  }

  focusSearch() {
    console.log (this.search);
    this.search.nativeElement.focus();
  }

}

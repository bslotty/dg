import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { AccountFormService } from 'src/app/modules/account/services/account-form.service';
import { FormGroup } from '@angular/forms';
import { AccountBackend, Player } from 'src/app/modules/account/services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { flyInPanelRow, scorecardSlide } from 'src/app/animations';
import { Score } from '../../services/backend.service';


@Component({
  selector: 'app-select-players',
  templateUrl: './select-players.component.html',
  styleUrls: ['./select-players.component.scss'],
  animations: [flyInPanelRow],
})
export class SelectPlayersComponent implements OnInit {

  form: FormGroup;
  results: Score[] = [];

  @Output() selected: EventEmitter<Player> = new EventEmitter();

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
        this.results = p.map((v)=>{
          var s = new Score();
          s.player = v;
          return s;
        });
      }
      this.feed.loading = false;
    });
  }

  includePlayer($event) {
    this.selected.emit($event.score);

    this.results.forEach((v, i) => {
      if (v.id == $event.score.player.id) {
        this.results.splice(i, 1);
      }
    });

  }

  trackBy(index, item) {
    return item.id;
  }

  focusSearch() {
    this.search.nativeElement.focus();
  }

}

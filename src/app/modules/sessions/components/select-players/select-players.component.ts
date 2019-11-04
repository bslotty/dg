import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { AccountFormService } from 'src/app/modules/account/services/account-form.service';
import { FormGroup } from '@angular/forms';
import { AccountBackend, Player } from 'src/app/modules/account/services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { MatFormFieldControl } from '@angular/material';


@Component({
  selector: 'app-select-players',
  templateUrl: './select-players.component.html',
  styleUrls: ['./select-players.component.scss']
})
export class SelectPlayersComponent implements OnInit {

  form: FormGroup;
  results: Player[] = [];

  @Output() selected: EventEmitter<Player> = new EventEmitter();

  @ViewChild("search", {static: true}) search;

  constructor(
    private accountForm: AccountFormService,
    private accounts: AccountBackend,
    private feed: FeedbackService,
  ) { }

  ngOnInit() {
    console.log("resuslts.wtf?" ,this.results);

    //  Setup Form
    this.accountForm.Setup("search");
    this.accountForm.form$.subscribe((f)=>{
      this.form = f;
    });

    //  Load Upon Type
    this.form.valueChanges.subscribe((v)=>{
      if (v.length > 0) {
        this.feed.loading = true;
      } 
     
    });

    //  Listen to Player List Updates
    this.accounts.searchedPlayers$.subscribe((p)=>{
      if (p != undefined) {
        this.results = p;
      }
      this.feed.loading = false;
    });
  }

  includePlayer(player) {
    this.selected.emit(player);

    this.results.forEach((v, i) =>{
      if (v.id == player.id) {
        this.results.splice(i, 1);
      }
    });

    this.form.get('term').reset();
  }

  focusSearch() {
    this.search.nativeElement.focus();
  }

}

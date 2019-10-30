import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AccountFormService } from 'src/app/modules/account/services/account-form.service';
import { FormGroup } from '@angular/forms';
import { AccountBackend, Player } from 'src/app/modules/account/services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';


@Component({
  selector: 'app-select-players',
  templateUrl: './select-players.component.html',
  styleUrls: ['./select-players.component.scss']
})
export class SelectPlayersComponent implements OnInit {

  form: FormGroup;
  results: Player[] = [];

  @Output() selected: EventEmitter<Player> = new EventEmitter();

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

    //  Listen to Player List Updates
    this.accounts.searchedPlayers$.subscribe((p)=>{
      console.log ("SearchedPlayers: ", p);
      if (p != undefined) {
        this.results = p;
      }
      
    });
  }

  includePlayer(player) {
    this.selected.emit(player);
  }

}

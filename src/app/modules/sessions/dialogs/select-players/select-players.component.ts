import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { flyInPanelRow, flyIn } from 'src/app/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ScoresFormService } from 'src/app/modules/scores/services/scores-form.service';
import { ScoresBackend } from 'src/app/modules/scores/services/backend.service';
import { listCategories } from 'src/app/shared/types';


@Component({
  selector: 'app-select-players',
  templateUrl: './select-players.component.html',
  styleUrls: ['./select-players.component.scss'],
  animations: [flyInPanelRow, flyIn],
})
export class SelectPlayersComponent implements OnInit {

  @Input() options: Object = {
    list: ["search"],
    row: ["full", "email", "selector"],
  };

  lists: Array<listCategories>;
  selectedList: listCategories;

  search: boolean = false;
  form: FormGroup;

  constructor(
    private _scoresForm: ScoresFormService,
    private _scores: ScoresBackend,
    private feed: FeedbackService,
    private dialogRef: MatDialogRef<SelectPlayersComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
  ) { }


  ngOnInit() {
    this._scores.listRecient();

    //  List Selection
    this.lists = [
      {
        name: "recent",
        obs: this._scores.recientPlayers$,
      }, {
        name: "search",
        obs: this._scores.searchedPlayers$,
      }
    ];

    //  Default Option
    this.selectedList = this.lists[0];


    //  Setup Form
    this._scoresForm.Setup('search');
    this._scoresForm.form$.subscribe((f) => {
      this.form = f;
      this.feed.loading = false;

      console.log ("this.form: ", this.form);
    });

    
  }

  toggleSearch() {
    this.search = !this.search;

    if (this.search) {
      this.showSearch();
    } else {
      this.hideSearch();
    }
  }

  showSearch() {

    //  Update Flag
    this.search = true;

    //  Set Dropdown to Search
    this.selectedList = this.lists.find((l) => {
      return l.name == "search";
    });

    //  Clear Field
    this._scoresForm.resetPlayerSearch();

    //  Turn Off Loader
    this.feed.loading = false;
  }

  hideSearch() {
    //  Update Flag
    this.search = false;

    //  Set list to Default
    this.selectedList = this.lists[0];

    //  Turn Off Loader
    this.feed.loading = false;
  }

  selectChange($event) {
    this.selectedList = this.lists.find((l) => {
      return l.name == $event.value.name;
    });

    if ($event.value.name == 'search') {
      this.showSearch();
    } else {
      this.hideSearch();
    }
  }


  trackBy(index, item) {
    return item.id;
  }

  close() {
    this.dialogRef.close();
  }
}

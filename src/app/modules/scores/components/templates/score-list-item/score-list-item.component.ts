import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Team } from 'src/app/modules/stats/services/backend.service';
import { MatDialog } from '@angular/material';
import { Score } from 'src/app/modules/sessions/services/backend.service';
import { ScoreSettingsComponent } from '../../score-settings/score-settings.component';

@Component({
  selector: 'score-list-item',
  templateUrl: './score-list-item.component.html',
  styleUrls: ['./score-list-item.component.scss']
})
export class ScoreListItemComponent implements OnInit {

  @Input() mode: string = "";
  @Input() score: Score;
  @Input() team: Team;

  @Output() action: EventEmitter<Object> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() { }

  remove() {
    this.action.emit({
      "action": "remove",
      "score": this.score
    });
  }

  include() {
    this.action.emit({
      "action": "add",
      "score": this.score
    });
  }

  openSettings() {
    this.dialog.open(ScoreSettingsComponent, {
      data: this.score,
      width: "80vw",
    })
  }

}






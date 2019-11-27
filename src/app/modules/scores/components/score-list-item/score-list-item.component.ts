import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ScoreSettingsComponent } from '../../dialogs/score-settings/score-settings.component';
import { flyInPanelRow } from 'src/app/animations';
import { Score } from '../../services/backend.service';
import { SessionBackend } from 'src/app/modules/sessions/services/backend.service';

@Component({
  selector: 'score-list-item',
  templateUrl: './score-list-item.component.html',
  styleUrls: ['./score-list-item.component.scss'],
  animations: [flyInPanelRow]
})
export class ScoreListItemComponent implements OnInit {

  @Input() nameMode: string = "full"; // short
  @Input() actionMode: string[]

  @Input() mode: string[]

  @Input() score: Score;
  @Output() action: EventEmitter<Object> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private sessions_: SessionBackend,
  ) { }

  ngOnInit() {  }

  remove() {
    this.action.emit({
      "action": "remove",
      "score": this.score
    });
    this.sessions_.removeScore(this.score);
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






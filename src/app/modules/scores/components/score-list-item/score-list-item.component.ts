import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ScoreSettingsComponent } from '../../dialogs/score-settings/score-settings.component';
import { flyInPanelRow } from 'src/app/animations';
import { Score, ScoresBackend } from '../../services/backend.service';
import { SessionBackend } from 'src/app/modules/sessions/services/backend.service';

@Component({
  selector: 'score-list-item',
  templateUrl: './score-list-item.component.html',
  styleUrls: ['./score-list-item.component.scss'],
  animations: [flyInPanelRow]
})
export class ScoreListItemComponent implements OnInit {

  @Input() mode: string[]
  @Input() score: Score;

  @Input() backdrop: boolean = false;

  private selectorCheckbox: boolean;

  constructor(
    private dialog: MatDialog,
    private sessions_: SessionBackend,
    private scores_:ScoresBackend,
  ) { }

  ngOnInit() {
    this.selectorCheckbox = this.sessions_.getScore(this.score);
  }

  remove() {
    this.sessions_.removeScore(this.score);
  }

  toggleScore($event, score) {
    if ($event.checked == true) {
      this.sessions_.addScore(score);
    } else {
      this.sessions_.removeScore(score)
    }
    
  }



  openSettings() {
    this.dialog.open(ScoreSettingsComponent, {
      data: this.score,
    })
  }

}






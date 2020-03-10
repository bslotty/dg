import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ScoreSettingsComponent } from '../../dialogs/score-settings/score-settings.component';
import { flyInPanelRow } from 'src/app/animations';
import { SessionBackend } from 'src/app/modules/sessions/services/backend.service';
import { Score } from 'src/app/shared/types';

@Component({
  selector: 'score-list-item',
  templateUrl: './score-list-item.component.html',
  styleUrls: ['./score-list-item.component.scss'],
  animations: [flyInPanelRow]
})
export class ScoreListItemComponent implements OnInit {

  @Input() mode: string[] = ["full"];
  @Input() score: Score;

  private selectorCheckbox: boolean;

  constructor(
    private dialog: MatDialog,
    private sessions_: SessionBackend,
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
      this.sessions_.removeScore(score);
    }
  }



  openSettings() {
    this.dialog.open(ScoreSettingsComponent, {
      data: this.score,
    })
  }

}






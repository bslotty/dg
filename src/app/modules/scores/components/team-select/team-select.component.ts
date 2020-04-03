import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SessionFormService } from 'src/app/modules/sessions/services/form.service';
import { ScoresBackend } from '../../services/backend.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { TeamSettingsComponent } from '../../dialogs/team-settings/team-settings.component';
import { SessionBackend } from 'src/app/modules/sessions/services/backend.service';

@Component({
  selector: 'team-select',
  templateUrl: './team-select.component.html',
  styleUrls: ['./team-select.component.scss']
})
export class TeamSelectComponent implements OnInit {

  private rstr = this._scores.roster$;
  private playerModes = ["full", "admin", "remove"];

  constructor(
    private _sessions: SessionBackend,
    private _scores: ScoresBackend,
    private dialog: MatDialog
  ) { }

  ngOnInit() {  }


  rosterDrop(event: CdkDragDrop<string[]>) {
    this._scores.movePlayer(event);
  }


  getPlayerList(team) {
    return this._scores.getRoster(team);
  }

  openSettings(team) {
    this.dialog.open(TeamSettingsComponent, {
      minWidth: "75vw",
      data: team,
    });
  }

  removeTeam(team) {
    this._scores.removeTeam(team);
  }

  trackTeamBy(index, item) {
    item.name;
  }
}

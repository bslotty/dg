import { Component, OnInit } from '@angular/core';
import { ScoresBackend } from '../../services/backend.service';
import { MatDialog } from '@angular/material';
import { TeamSettingsComponent } from '../../dialogs/team-settings/team-settings.component';
import { flyIn } from 'src/app/animations';
import { SessionFormService } from 'src/app/modules/sessions/services/form.service';

@Component({
  selector: 'team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  animations: [flyIn],
})
export class TeamListComponent implements OnInit {

  private playerModes = ["full", "admin"];

  constructor(
    private _scores: ScoresBackend,
    private _sessionForm: SessionFormService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  teamSettings(team) {
    this.dialog.open(TeamSettingsComponent, {
      data: team,
    })
  }

}

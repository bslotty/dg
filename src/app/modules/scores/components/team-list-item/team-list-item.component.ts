import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TeamSettingsComponent } from '../../dialogs/team-settings/team-settings.component';
import { SessionBackend } from 'src/app/modules/sessions/services/backend.service';
import { SessionFormService } from 'src/app/modules/sessions/services/form.service';
import { Team } from '../../services/backend.service';

@Component({
  selector: 'team-list-item',
  templateUrl: './team-list-item.component.html',
  styleUrls: ['./team-list-item.component.scss']
})
export class TeamListItemComponent implements OnInit {

  @Input() mode: Array<string> = []; 
  @Input() team: Team;

  constructor(
    private dialog: MatDialog,
    private sessions_:SessionBackend,
  ) { }

  ngOnInit() { }

  removeTeam(team) {
    this.sessions_.removeTeam(team);
  }


  openSettings() {
    this.dialog.open(TeamSettingsComponent, {
      data: this.team,
    })
  }
}

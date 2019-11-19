import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TeamSettingsComponent } from '../team-settings/team-settings.component';
import { Team } from 'src/app/modules/stats/services/backend.service';
import { SessionFormService } from 'src/app/modules/sessions/services/form.service';

@Component({
  selector: 'team-list-item',
  templateUrl: './team-list-item.component.html',
  styleUrls: ['./team-list-item.component.scss']
})
export class TeamListItemComponent implements OnInit {

  @Input() mode: string = ""; 
  @Input() team: Team;

  constructor(
    private dialog: MatDialog,
    private sessionsF:SessionFormService,
  ) { }

  ngOnInit() { }

  addToSession() {

  }

  removeFromSession() {

  }

  addTeam() {
    this.sessionsF.addTeam();

  }

  removeTeam(team) {
    this.sessionsF.removeTeam(team);
  }


  openSettings() {
    this.dialog.open(TeamSettingsComponent, {
      data: this.team,
    })
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TeamSettingsComponent } from '../team-settings/team-settings.component';
import { Team } from 'src/app/modules/stats/services/backend.service';
import { flyInPanelRow } from 'src/app/animations';

@Component({
  selector: 'team-list-item',
  templateUrl: './team-list-item.component.html',
  styleUrls: ['./team-list-item.component.scss'],
  animations: [flyInPanelRow]
})
export class TeamListItemComponent implements OnInit {

  @Input() mode: string = ""; 
  @Input() team: Team;

  @Output() action: EventEmitter<Object> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() { }

  remove() {
    this.action.emit({
      "action": "remove",
      "player": this.team
    });
  }

  include() {
    this.action.emit({
      "action": "add",
      "player": this.team
    });
  }

  openSettings() {
    this.dialog.open(TeamSettingsComponent, {
      data: this.team,
    })
  }
}

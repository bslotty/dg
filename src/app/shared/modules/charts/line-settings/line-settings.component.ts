import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Stats, Team } from '../../../../modules/stats/services/backend.service';

@Component({
  selector: 'app-line-settings',
  templateUrl: './line-settings.component.html',
  styleUrls: ['./line-settings.component.css']
})
export class LineSettingsComponent implements OnInit {

  colList = this.data.scores.columns.filter((v, i) => {
    return v.toLowerCase() != "hole";
  });
  selectedColumns = this.colList;

  teamList;
  playerList;

  activePlayerList;
  activeTeamList;


  availableColors = this.data["colors"];

  headerButtons = [{
    action: 'close',
    color: 'transparent-primary',
    icon: 'icon-x',
  }];

  // mat-select: throws | score
  playerFormat: string = "scores";
  teamFormat: string = this.data.format;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LineSettingsComponent>,
  ) { }

  ngOnInit() {
    console.log("settings.data: ", this.data);
  }

  actionClick($event) {
    if ($event == "close") {
      this.dialogRef.close();
    }
  }

  getColor(ent) {
    if (ent instanceof Stats) {
      return ent.color;
    } else if (ent instanceof Team) {
      return ent.hex;
    }
  }

  close(data) {
    this.dialogRef.close(data);
  }


  updateFormat($event) {
    this.playerFormat = $event.value;
  }

  updatePlayers($event) {
    this.selectedColumns = $event.value;
  }

  updateTeamFormat($event) {
    this.teamFormat = $event.value;
  }

  updateChart() {
    var data = {
      selectedColumns: this.selectedColumns,
      format: this.playerFormat,
      teamFormat: this.teamFormat,
    };

    this.close(data);
  }


  toggleVisibility(person, action) {
    if (action == "remove") {
      this.selectedColumns = this.selectedColumns.filter((v) => { return person != v; });
    } else if (action == "add") {
      this.selectedColumns.push(person);
    }
    console.log("selectedColumns: ", this.selectedColumns);
  }

}

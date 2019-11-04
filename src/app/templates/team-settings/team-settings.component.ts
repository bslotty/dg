import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'team-settings',
  templateUrl: './team-settings.component.html',
  styleUrls: ['./team-settings.component.scss']
})
export class TeamSettingsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<TeamSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
  ) { }

  ngOnInit() {
  }

}

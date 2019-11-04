import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'score-settings',
  templateUrl: './score-settings.component.html',
  styleUrls: ['./score-settings.component.scss']
})
export class ScoreSettingsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ScoreSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
  ) { }

  ngOnInit() {
  }

}

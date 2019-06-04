import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-line-settings',
  templateUrl: './line-settings.component.html',
  styleUrls: ['./line-settings.component.css']
})
export class LineSettingsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LineSettingsComponent>,
  ) { }

  ngOnInit() {
    console.log ("settings.data", this.data);
  }

  close() {
    
  }

}

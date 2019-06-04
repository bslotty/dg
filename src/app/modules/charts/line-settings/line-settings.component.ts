import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-line-settings',
  templateUrl: './line-settings.component.html',
  styleUrls: ['./line-settings.component.css']
})
export class LineSettingsComponent implements OnInit {

  colList = this.data.columns.filter((v, i)=>{
    return v.toLowerCase() != "hole";
  });

  availableColors = [
    "#e66969", "#6ab9e8", "#60df60",
    "#d6d05d", "#d8a95d", "#9461e0",
    "#cf58c5"];

  backButton = [{
    action: 'close', 
    color: 'transparent-primary', 
    icon: 'icon-x',
  }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LineSettingsComponent>,
  ) { }

  ngOnInit() {
    console.log ("settings.data", this.data);
    console.log ("settings.colList", this.colList);
    console.log ("settings.availableColors", this.availableColors);

  }


  actionClick($event){
    console.log ("ActionClick.Event: ", $event);
    if ($event == "close") {
      this.dialogRef.close();
    }
  }

  updateChart() {

  }

}

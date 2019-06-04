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


  // mat-select: throws | score
  playerFormat:string = "scores"; 
  teamFormat: string = this.data.team ? "scores" : null ;
  playerList = this.colList;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LineSettingsComponent>,
  ) { }

  ngOnInit() {  }

  actionClick($event){
    console.log ("ActionClick.Event: ", $event);
    if ($event == "close") {
      this.dialogRef.close();
    }
  }

  close(data){
    this.dialogRef.close(data);
  }


  updateFormat($event) {
    this.playerFormat = $event.value;
  }

  updatePlayers ($event) {
    this.playerList = $event.value;
  }

  updateTeamFormat($event) {
    this.teamFormat = $event.value;
  }

  updateChart() {
    var data = {
      players: this.playerList,
      format: this.playerFormat,
      teamFormat: this.teamFormat,
    };

    this.close(data);
  }

}

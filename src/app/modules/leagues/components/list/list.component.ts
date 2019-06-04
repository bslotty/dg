import { Component, OnInit } from '@angular/core';
import { League, LeagueBackend } from './../../services/backend.service';
import { Observable, Subject } from 'rxjs';
import { flyInPanelRow, flyIn } from 'src/app/animations';
import { MatDialog } from '@angular/material';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [flyInPanelRow, flyIn]
})
export class ListComponent implements OnInit {

  savedLeagues: League[];
  resolve: boolean = false;

  headerButtons = [{
    color: "transparent-primary",
    icon: "icon-plus",
    action: "create"
  }]

  constructor(
    public leagues: LeagueBackend,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.leagues.getList().subscribe((leagues)=>{
      this.savedLeagues = leagues;
      this.resolve = true;
    });
  }

  actionClick($event) {
    if ($event == "create") {
      this.createLeague();
    }
  }

  createLeague() {
    this.dialog.open(CreateComponent, {
      data: { }
    });
  }

}
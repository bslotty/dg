import { flyInPanelRow } from './../../../../animations';
import { ActivatedRoute } from '@angular/router';
import { League, LeagueBackend } from './../../services/backend.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [flyInPanelRow]
})

export class DetailComponent implements OnInit {

  league: League = new League(this.route.snapshot.paramMap.get("league"));
  resolve: boolean = false;

  headerButtons = [
    {
      icon: "icon-settings",
      color: "transparent-primary",
      action: "edit",
    }
  ];

  constructor(
    public leagues: LeagueBackend,
    public route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    //  Subscribe to Required Observables
    this.leagues.getDetail(this.league).subscribe((league) => {


      //  Store Data For Children
      this.league = league as League;

      //  Show Content
      this.resolve = true;
    });

  }

  actionClick($event) {
    if ($event == "edit") {
      this.editLeague();
    }
  }

  editLeague() {
    this.dialog.open(EditComponent, {
      maxWidth: "95vw",
      data: { league: this.league }
    });
  }


}

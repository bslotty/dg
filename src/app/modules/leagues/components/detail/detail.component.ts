import { flyInPanelRow } from './../../../../animations';
import { ActivatedRoute, GuardsCheckEnd } from '@angular/router';
import { League, LeagueBackend } from './../../services/backend.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material';
import { EditComponent } from '../edit/edit.component';
import { DeleteComponent } from '../delete/delete.component';
import { PermissionBackend, Permission } from 'src/app/modules/permissions/services/backend.service';
import { SessionBackend, Session } from 'src/app/modules/sessions/services/backend.service';
import { Observable, combineLatest } from 'rxjs';

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
    }, {
      icon: "icon-trash-2",
      color: "transparent-warn",
      action: "delete",
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
    } else if ($event == "delete") {
      this.deleteLeague();
    }
  }

  editLeague() {
    this.dialog.open(EditComponent, {
      data: { league: this.league }
    });
  }

  deleteLeague() {
    this.dialog.open(DeleteComponent, {
      data: { league: this.league }
    });
  }

}

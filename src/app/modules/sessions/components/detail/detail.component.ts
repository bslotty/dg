import { FeedbackService } from './../../../feedback/services/feedback.service';
import { flyInPanelRow } from './../../../../animations';
import { Component, OnInit } from '@angular/core';
import { LeagueBackend, League } from 'src/app/modules/leagues/services/backend.service';
import { SessionBackend, Session } from 'src/app/modules/sessions/services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { EditComponent } from '../edit/edit.component';
import { DeleteComponent } from '../delete/delete.component';
import { StatsBackend } from 'src/app/modules/stats/services/backend.service';
import { FormatDetailsComponent } from '../format-details/format-details.component';
import { PermissionBackend } from 'src/app/modules/permissions/services/backend.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [flyInPanelRow]
})
export class DetailComponent implements OnInit {

  league: League = new League(this.route.snapshot.paramMap.get("league"));
  session: Session = new Session(this.route.snapshot.paramMap.get("session"));

  resolve: boolean = false;
  format: string;

  constructor(
    public route: ActivatedRoute,
    public leagues: LeagueBackend,
    public sessions: SessionBackend,
    public feed: FeedbackService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.populateData();

  }

  populateData() {
    //  Subscribe to Required Observables
    this.sessions.getDetail(this.session).subscribe((session) => {

      //  Store Data For Children
      this.session = session as Session;


      this.formatDisplay();

      //  Show Content
      this.resolve = true;
    });
  }

  formatDisplay() {
    switch (this.session.format) {
      case "ffa":
        this.format = "Free For All";
        break;

      case "team-best":
        this.format = "Teams: Best";
        break;

      case "team-average":
        this.format = "Teams: Average Score";
        break;

      case "team-sum":
        this.format = "Teams: Sum Score";
        break;

      default:
        this.format = "Undetermined";
        break;
    }
  }

  editSession() {
    const editDiag = this.dialog.open(EditComponent, {
      data: { session: this.session, league: this.league }
    });

    editDiag.afterClosed().subscribe((diag) => {
      this.populateData();
    });
  }

  deleteSession() {
    this.dialog.open(DeleteComponent, {
      data: { session: this.session, league: this.league }
    });
  }

  changeFormat() {
    const formatDiag = this.dialog.open(FormatDetailsComponent, {
      data: { session: this.session, league: this.league }
    });

    formatDiag.afterClosed().subscribe((diag) => {
      this.populateData();
    });
  }
}

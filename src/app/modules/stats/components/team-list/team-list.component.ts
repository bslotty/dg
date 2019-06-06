import { Component, OnInit, Input } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Team, StatsBackend } from '../../services/backend.service';
import { MatDialog } from '@angular/material';
import { CreateTeamComponent } from '../create-team/create-team.component';
import { ActivatedRoute } from '@angular/router';
import { flyInPanelRow } from 'src/app/animations';
import { Session, SessionBackend } from 'src/app/modules/sessions/services/backend.service';
import { League } from 'src/app/modules/leagues/services/backend.service';
import { DeleteTeamComponent } from '../delete-team/delete-team.component';
import { EditTeamComponent } from '../edit-team/edit-team.component';
import { PermissionBackend } from 'src/app/modules/permissions/services/backend.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css'],
  animations: [flyInPanelRow]
})
export class TeamListComponent implements OnInit {

  teamList: Team[];
  status: string;
  hasAccess: boolean = false;
  resolve: boolean = false;

  @Input() session: Session;
  @Input() league: League;

  headerButtons = [{
    action: "create",
    icon: "icon-plus",
    color: "transparent-primary"
  }];

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public stats: StatsBackend,
    public permissions: PermissionBackend,
    public account: AccountBackend,
    public sessions: SessionBackend,
  ) { }

  ngOnInit() {
    this.populateData();
  }

  populateData() {
    combineLatest(
      this.stats.getList(this.session),
      this.permissions.memberList(this.league),
      this.stats.getTeams(this.session),
    ).subscribe(([players, members, teams]) => {

      //  Admin Check
      members.filter((member) => {
        if (this.account.user.id == member.user.id) {
          if (
            member.level == "creator" ||
            member.level == "moderator"
          ) {
            this.hasAccess = true;
          }
        }
      });

      //  Status
      this.status = 'ready';
      if (this.session.format != 'ffa' && teams.length == 0) {
        this.status = 'warn';
      }

      //  Only Sort if Ready
      if (this.status == 'ready') {

        //  Show Data
        this.teamList = this.stats.populateTeamScores(teams, players, this.session);
      }

      this.resolve = true;

    });

  }

  trackBy(index, item) {
    return item.id;
  }

  actionClick($event) {
    if ($event == "create") {
      this.createTeam();
    }
  }

  createTeam() {
    const createDiag = this.dialog.open(CreateTeamComponent, {
      data: {
        session: this.session,
        league: this.league,
      }
    });

    createDiag.afterClosed().subscribe((diag) => {
      if (diag != null) {
        this.populateData();
      }
    });
  }

  deleteTeam(team) {
    const deleteDialog = this.dialog.open(DeleteTeamComponent, {
      data: {
        session: this.session,
        league: this.league,
        team: team,
      }
    });

    deleteDialog.afterClosed().subscribe((diag) => {
      if (diag != null) {
        this.populateData();
      }
    });
  }

  editTeam(team) {
    const editDialog = this.dialog.open(EditTeamComponent, {
      data: {
        session: this.session,
        league: this.league,
        team: team,
      }
    });

    editDialog.afterClosed().subscribe((diag) => {
      if (diag != null) {
        this.populateData();
        this.stats.update$.next(true);
      }
    });
  }

}

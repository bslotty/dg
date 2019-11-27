import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Permission, PermissionBackend } from 'src/app/modules/permissions/services/backend.service';
import { Team, StatsBackend, Stats } from '../../services/backend.service';
import { League } from 'src/app/modules/leagues/services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { MatDialog } from '@angular/material';
import { PermGuard } from 'src/app/guards/perm.service';
import { combineLatest } from 'rxjs';
import { CreatePlayerComponent } from '../create-player/create-player.component';
import { Session } from 'src/app/modules/sessions/services/backend.service';
import { flyInPanelRow } from 'src/app/animations';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { DeletePlayerComponent } from '../delete-player/delete-player.component';
import { MergeTempUsersComponent } from '../merge-temp-users/merge-temp-users.component';
import { Chart } from 'src/app/shared/modules/charts/line/line.component';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css'],
  animations: [flyInPanelRow]
})
export class PlayerListComponent implements OnInit {
  
  hasAccess: boolean = false;
  resolve: boolean = false;
  status: string;

  memberList: Permission[] = [];
  playerList: Stats[] = [];
  teamList: Team[] = [];
  tempMembers: Permission[] = [];

  @Input() session: Session;
  @Input() league: League;

  chartData;

  headerButtons = [{
    action: "create",
    icon: "icon-plus",
    color: "transparent-primary",
  }];

  constructor(
    public route: ActivatedRoute,
    public stats: StatsBackend,
    public permissions: PermissionBackend,
    public account: AccountBackend,
    public feed: FeedbackService,
    public dialog: MatDialog,
    public guard: PermGuard,
  ) { }

  ngOnInit() {
    this.populateData();

    this.stats.update$.subscribe((update) => {
      this.populateData();
    });
  }

  actionClick($event) {
    if ($event == "create") {
      this.addPlayer();
    }
  }

  populateData() {
    combineLatest(
      this.stats.getList(this.session),
      this.permissions.memberList(this.league),
      this.stats.getTeams(this.session),
    ).subscribe(([players, members, teams]) => {
      /*
      console.log("\nPlayerList");
      console.log("permissions.members: ", members);
      console.log("stats.players:", players);
      console.log("stats.teams:", teams);
      */

      //  Admin Check
      members.map((member) => {
        if (this.account.user.id == member.user.id) {
          if (
            member.level == "creator" ||
            member.level == "moderator"
          ) {
            this.hasAccess = true;
          }
        }
      });


      //  Temp User Count
      this.tempMembers = players.filter((player) => {
        return player['user']['last'] == "temp";
      });

      //  Status
      this.status = "ready";
      if (this.session.format != 'ffa' && teams.length == 0) {
        this.status = 'disabled';

      } else if (this.session.format != 'ffa' && teams.length > 0 && players.length == 0) {
        this.status = 'warn'

      } else if (this.session.format == 'ffa' && players.length == 0) {
        this.status = 'warn';
      }

       //  Data Store
       this.memberList = members;
       this.playerList = this.stats.populatePlayerScores(players, this.session.par);
        this.teamList = this.stats.populateTeamScores(teams, players, this.session.par);

      //  Only Sort if Ready
      if (this.status == 'ready') {

        

        //  Format Chart Data;
        this.chartData = this.stats.formatChart(this.playerList, this.session.format,  "scores", this.teamList,);

        //  console.log ("player.list.chartData: ", this.chartData);
      }

      this.resolve = true;
    });
  }



  addPlayer() {
    const addDiag = this.dialog.open(CreatePlayerComponent, {
      data: {
        league: this.league,
        session: this.session,
        memberList: this.memberList,
        playerList: this.playerList,
        teamList: this.teamList,
      }
    });

    addDiag.afterClosed().subscribe((diag) => {
      this.populateData();
    });
  }

  editPlayer(user) {
    const editDiag = this.dialog.open(EditPlayerComponent, {
      width: "500px",
      data: {
        league: this.league,
        session: this.session,
        user: user,
        teamList: this.teamList,
      }
    });

    //  Subscribe to Dialog Changes
    editDiag.afterClosed().subscribe((res) => {
      this.populateData();
    });
  }

  mergePlayer() {
    const mergeDiag = this.dialog.open(MergeTempUsersComponent, {
      width: "500px",
      data: {
        league: this.league,
        session: this.session,
        members: this.memberList,
        players: this.playerList,
        tempUsers: this.tempMembers,
      }
    });

    //  Subscribe to Dialog Changes
    mergeDiag.afterClosed().subscribe((res) => {
      this.populateData();
    });
  }

  removePlayer(user) {
    const removeDiag = this.dialog.open(DeletePlayerComponent, {
      width: "500px",
      data: {
        league: this.league,
        session: this.session,
        user: user
      }
    });

    //  Subscribe to Dialog Changes
    removeDiag.afterClosed().subscribe((res) => {
      this.populateData();
    });
  }


}
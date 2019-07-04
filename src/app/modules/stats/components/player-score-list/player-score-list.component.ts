import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Session, SessionBackend } from 'src/app/modules/sessions/services/backend.service';
import { League } from 'src/app/modules/leagues/services/backend.service';
import { MatSort, MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { StatsBackend, Stats, Team } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { combineLatest, interval, of, Observable } from 'rxjs';
import { flyInPanelRow, scorecardSlide } from 'src/app/animations';
import { PermissionBackend, Permission } from 'src/app/modules/permissions/services/backend.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';

@Component({
  selector: 'app-player-score-list',
  templateUrl: './player-score-list.component.html',
  styleUrls: ['./player-score-list.component.css'],
  animations: [flyInPanelRow, scorecardSlide]
})
export class PlayerScoreListComponent implements OnInit,OnDestroy {

  public league: League = new League(this.route.snapshot.paramMap.get("league"));
  public session: Session = new Session(this.route.snapshot.paramMap.get("session"));

  public preData = [];  /*  Workaround For DataSource Population; Get everything into array, then set as DataSource */
  public dataSource = [];
  public displayedColumns = ["name", "throws"];

  public tabIndex: number = 1;
  public par: Array<any> = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];

  resolve: boolean = false;
  hasAccess: boolean = false;
  memberList: Permission[] = [];
  playerList: Stats[] = [];
  teamList: Team[] = [];
  tempMembers: Permission[] = [];

  autoSave;

  constructor(
    public route: ActivatedRoute,
    public account: AccountBackend,
    public sessions: SessionBackend,
    public stats: StatsBackend,
    public permissions: PermissionBackend,
    public feed: FeedbackService,

  ) { }

  ngOnInit() {
    this.populateData();

    //  Save every 60 secs;
    this.autoSave = interval(60000).subscribe((res)=>{
      this.saveRoster();
    });
  }

  ngOnDestroy() {
    this.autoSave.unsubscribe();
  }

  populateData() {
   
    combineLatest(
      this.stats.getList(this.session),
      this.permissions.memberList(this.league),
      this.sessions.getDetail(this.session),
    ).subscribe(([players, members, session]) => {
      /*
      console.log("\nPlayerScoreList");
      console.log("permissions.members: ", members);
      console.log("stats.players:", players);
      console.log("sessions.session:", session);
      */

      //  Insert Par & Details
      this.session = session as Session;

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


      //  Calculate Score
      players.filter((player) => {
        this.updateTotalScore(player);
      });

      //  Sort by Score
      players = players.sort((a, b) => {
        return a['score'] - b['score'];
      });


      //  Spread
      var leaderScore = players[0]['score'] ? players[0]['score'] : 0;

      players.filter((player, i) => {
        if (i == 0) {
          player['spread'] = "Leader";
        } else {
          player['spread'] = player['score'] - leaderScore;

          //  Possible Tied Message here?
        }

      });

      this.playerList = players;
      this.resolve = true;
    });


  }

  updateTotalScore(player) {
    var score = 0;

    player['throws'].filter((attempt, index) => {
      score = score + (attempt - this.session.par[index]);
    });

    player['score'] = score;
  }

  saveRoster() {


    var playerList = this.playerList.filter((player) => {
      player["throwString"] = JSON.stringify(player.throws);
      return player;
    });

    var session = this.session;
    session["parString"] = JSON.stringify(session.par);



    //  update pars and stats
    this.stats.updateStats(this.league, session, playerList).subscribe((res) => {

      this.feed.finializeLoading(res, true);
    });
  }



  incPar() {
    this.session.par[this.tabIndex - 1]++;
    this.playerList.forEach((player) => {
      this.incThrow(player);
      this.updateTotalScore(player);
    });

  }

  decPar() {
    if (this.session.par[this.tabIndex - 1] > 1) {
      this.session.par[this.tabIndex - 1]--;
      this.playerList.forEach((player) => {
        this.decThrow(player);
        this.updateTotalScore(player);
      });

    }
  }

  incHole() {
    if (this.tabIndex < 18) {
      this.tabIndex++;
    }
  }

  decHole() {
    if (this.tabIndex > 1) {
      this.tabIndex--;
    }
  }

  incThrow(player) {
    if (this.tabIndex != 0) {
      player.throws[this.tabIndex - 1]++;
      this.updateTotalScore(player);
    }
  }

  decThrow(player) {
    if (player.throws[this.tabIndex - 1] > 0) {
      player.throws[this.tabIndex - 1]--;
      this.updateTotalScore(player);
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { AccountBackend } from '../../account/services/backend.service';
import { SessionBackend } from '../../sessions/services/backend.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ServerPayload } from 'src/app/app.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Team, Score, TeamColor, Player } from 'src/app/shared/types';

@Injectable({
  providedIn: 'root'
})
export class ScoresBackend {

  url: string = environment.apiUrl + '/controllers/scores.php';

  private scores: BehaviorSubject<Score[]> = new BehaviorSubject<Score[]>([]);
  scores$: Observable<Score[]> = this.scores.asObservable();


  /*
   this._sessions.detail$.pipe(map(session => {
      let teams = session.scores.map((s) => s.team);
      let unique = teams.filter((e, i) => teams.findIndex(a => a.name === e.name) === i);
      return unique
    }))
    */


  private teams: BehaviorSubject<Team[]> = new BehaviorSubject<Team[]>([]);
  teams$: Observable<Team[]> = this.teams.asObservable();

  private roster: BehaviorSubject<Array<Score[]>> = new BehaviorSubject<Array<Score[]>>([]);
  roster$: Observable<Array<Score[]>> = this.roster.asObservable();



  private searchedPlayers: BehaviorSubject<Score[]> = new BehaviorSubject<Score[]>([])
  searchedPlayers$: Observable<Score[]> = this.searchedPlayers.asObservable();

  private recientPlayers: BehaviorSubject<Score[]> = new BehaviorSubject<Score[]>([])
  recientPlayers$: Observable<Score[]> = this.recientPlayers.asObservable();

  //  Team Colors
  teamColorList: TeamColor[] = [{
    name: "red",
    hex: "ad0000",
    available: true,
  }, {
    name: "blue",
    hex: "3052ff",
    available: true,
  }, {
    name: "green",
    hex: "30ff30",
    available: true,
  }, {
    name: "yellow",
    hex: "fcf22f",
    available: true,
  }, {
    name: "orange",
    hex: "fcad2e",
    available: true,
  }, {
    name: "purple",
    hex: "802efc",
    available: true,
  }, {
    name: "pink",
    hex: "fc2eea",
    available: true,
  }, {
    name: "white",
    hex: "FFFFFF",
    available: true,
  },];


  constructor(
    private _sessions: SessionBackend,
    private http: HttpClient,
    private account: AccountBackend,

    private helper: HelperService,
  ) {


    this._sessions.detail$.subscribe((s) => {
      console.log("scores.session.details: ", s);

      if (s != undefined) {

        //  Scores 
        this.scores.next(s.scores);

        //  Teams
        if (s.format != undefined) {

          if (typeof s.format['enum'] == "string" && s.format['enum'].indexOf("team") > -1) {
            this.setTeams(s.scores);
          }
        }
      }

    });


    //  Debug
    this.scores$.subscribe((s) => {
      console.log("scores$", s);
    });

    this.teams$.subscribe((t) => {
      console.log("teams$:", t);

      if (t != undefined) {
        t.forEach((t) => {
          this.teamColorList.forEach((c) => {
            if (t.color.name == c.name) {
              c.available = false;
            }
          });
        });
      }

      //  console.log ("updatedTeamList: ", this.teamColorList);
    });

    this.roster$.subscribe((r) => {
      console.log("roster$:", r);
    });
  }






  listRecient() {
    this.http.post(this.url, { action: "recent", user: this.account.user }).pipe(this.helper.pipe).subscribe((res: ServerPayload) => {

      this.recientPlayers.next(this.helper.rGetData(res));
    });
  }

  getSearch(term) {
    this.http.post(this.url, { action: "search", term: term }).pipe(this.helper.pipe).subscribe((res: ServerPayload) => {

      this.searchedPlayers.next(this.helper.rGetData(res));
    });
  }



  getTeamsFromScoreList(scores): Team[] {
    if (scores != undefined) {
      let teamList = scores.map((s) => s.team);
      let unique = teamList.filter((e, i) => teamList.findIndex(a => a.name === e.name) === i);
      return unique;
    }
  }

  getTeamPlayers(uniqueTeams: Team[]): void {
    if (this.scores.value != undefined) {
      var roster = [];

      uniqueTeams.forEach((t, ti) => {
        roster[ti] = this.scores.value.filter((s, si) => { return t.name == s.team.name });
      });

      this.roster.next(roster);
    }
  }


  addTeam() {
    //  Limit to 8
    if (this.teams.value.length < 8) {
      var color = this.teamColorList.find((t) => {
        return t.available == true;
      });

      //  Disable Color
      color.available = false;

      var newList = this.teams.value;
      newList.push(new Team(null, color.name, new TeamColor(color.name, color.hex, color.available)));

      this.teams.next(newList);
    } else {
      // Too Many
    }
  }

  removeTeam(team) {
    //  Remove Players From Team
    this.scores.value.forEach((s) => {
      if (s.team.name == team.name) {
        s.team = new Team(null, "unassigned", new TeamColor(null, null, true));
      }
    });


    //  Remove Team
    let newList;
    this.teams.value.forEach((v, i) => {
      if (team.name == v.name) {

        //  Update Availablity Status on Color
        this.teamColorList.find((c) => {
          if (c.name == team.name) {
            c.available = true;
            return true;
          }
        });

        newList = this.teams.value.filter((ta, ti) => { return i != ti });
      }
    });

    //  Remove Roster for Deleted Team
    this._sessions.clearRoster(team);

    //  Emit Updates
    this.teams.next(newList);
  }


  setTeams(scores): void {
    var teamList = this.getTeamsFromScoreList(scores);

    this.teams.next(teamList);
    this.getTeamPlayers(teamList);
  }

  removeScore(score) {
    this._sessions.removeScore(score);
  }



  getRoster(team: Team): Score[] {
    //  console.log("this.scores.value: ", this.scores);

    if (team != undefined) {
      return this.scores.value.filter(scores => {

        if (scores.team != undefined) {
          var scoreStr = scores.team.id + scores.team.name + scores.team.color.hex;
          var teamStr = team.id + team.name + team.color.hex;
          return scoreStr == teamStr;
        }

      });
    } else {
      return this.scores.value;
    }



  }

  movePlayer(event) {
    //  Get Destination Color Name
    var teamDestName = event.container.id.replace("team-", "");

    //  Get Team Object From Color Name
    var teamDest = this.teams.value.find((t) => {
      return t.color.name == teamDestName;
    });

    //  Move back to unassigned fix;
    if (teamDest == undefined) {
      teamDest = new Team(null, "unassigned", new TeamColor(null, null, true));
    }

    //  Update Player's Team
    this.scores.value.forEach((s) => {
      if (event.item.data.player.id == s.player.id) {
        s.team = teamDest;
      }
    });
  }


  //  Call when settings changes team info; need to update each team member;
  updateRosterTeam(current, destination) {
    //  console.log ("Update Team:", current, "to:", destination);

    this.scores.value.forEach((s) => {
      if (s.team.color.name == current.name) {
        s.team.color = destination;
      }
    });
  }


}

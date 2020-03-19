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

  serverPipe = pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  
  private teams: BehaviorSubject<Team[]> = new BehaviorSubject<Team[]>([]);
  teams$: Observable<Team[]> = this.teams.asObservable();

  private scores: BehaviorSubject<Score[]> = new BehaviorSubject<Score[]>([]);
  scores$: Observable<Score[]> = this.scores.asObservable();

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
      
      if (s != undefined) {
        console.log('scores.session.detail$:', s);
        console.log("s.format: ", s.format);
        
        //  Convert:: TODO

        //  Scores 
        this.setScores(s.scores);
        
        //  Teams
        if (s.format != undefined) {

          //  console.log("s.format.enum: ", s.format['enum']);
          //  console.log("s.format.indexof: ", s.format['enum'].indexOf("team"));

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
        t.forEach((t)=>{
          this.teamColorList.forEach((c)=>{
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


  
  /**
   * @param ServerPayload res Subscription Response
   * @returns boolean true if the latest query ran by the server was successfull;
   * -- else false
   */
  rCheck(res): boolean {
    var latest = res.length - 1;
    if (res[latest]["status"] == "success") {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @param ServerPayload res Subscription Response
   * @returns data results of request;
   */
  rGetData(res): Array<any> {
    var latest = res.length - 1;
    if (latest > -1) {
      return res[latest]["results"];
    } else {
      return [];
    }
    
  }

  convertProperties(res){
    var result: Score[] = [];

    this.rGetData(res).forEach((scores) => {
      var s = new Score();
      s.id = scores['scores.id'];
      s.player = new Player(scores['player.id'], scores['player.first_name'], scores['player.last_name'], scores['player.email']),
      s.scores = scores['scores.scores'];
      s.team = new Team(scores['team.id'], scores['team.name'], scores["team.color"], scores["team.hex"]);
      s.handicap = scores['scores.handicap'];
      result.push(s);
    });


    console.log("results: ", result);

    return result;
  }



  getTeamsFromScoreList(scores): Team[] {
    if (scores != undefined) {
      var teamList = scores.map((s) => s.team);
      var unique = teamList.filter((e, i) => teamList.findIndex(a => a.name === e.name) === i);

      unique.map((t)=>{

      });
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
    this.teams.value.forEach((v, i) => {
      if (team.name == v.name) {

        //  Update Availablity Status on Color
        this.teamColorList.find((c) => {
          if (c.name == team.name) {
            c.available = true;
            return true;
          }
        });

        var newList = this.teams.value.filter((ta, ti) => { return i != ti });
        this.teams.next(newList);

      }
    });

    //  Remove Roster for Deleted Team
    this._sessions.clearRoster(team);
  }


  setTeams(scores): void {
    var teamList = this.getTeamsFromScoreList(scores);

    this.teams.next(teamList);
    this.getTeamPlayers(teamList);
  }

  setScores(scores): void {
    this.scores.next(this.helper.convertScores(scores));
  }

  removeScore(score) {
    this._sessions.removeScore(score);
  }



  getRoster(team: Team): Score[] {
    console.log("this.scores.value: ", this.scores);

    if (team != undefined) {
      return this.scores.value.filter(scores => {

        if (scores.team != undefined) {
          var scoreStr  = scores.team.id + scores.team.name + scores.team.color.hex;
          var teamStr   = team.id + team.name + team.color.hex;
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

    this.scores.value.forEach((s)=>{
      if (s.team.color.name == current.name) {
        s.team.color = destination;
      }
    });
  }

  listRecient() {
    this.http.post(this.url, { action: "recient", user: this.account.user }).pipe(this.serverPipe).subscribe((res: ServerPayload) => {
      if (this.rCheck(res)) {
        this.recientPlayers.next(this.convertProperties(res));
      } else {
        this.recientPlayers.next([]);
      }
    });
  }

  getSearch(term) {
    this.http.post(this.url, { action: "search", term: term }).pipe(this.serverPipe).subscribe((res: ServerPayload) => {
      if (this.rCheck(res)) {
        this.searchedPlayers.next(this.convertProperties(res));
      } else {
        this.searchedPlayers.next([]);
      }
    });
  }
}

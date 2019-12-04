import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '../../account/services/backend.service';
import { SessionBackend, SessionFormat } from '../../sessions/services/backend.service';
import { SessionFormService } from '../../sessions/services/form.service';

@Injectable({
  providedIn: 'root'
})
export class ScoresBackend {

  /**   !!!!!!!!!!!!
   *  Might move score operations to here
   * 
   *  Could also just get it in the Session Services;
   * 
   *  Will also need to include Team functions
   * 
   *  Should this also include score operations from the play component;
   *  
   */

  private teams: BehaviorSubject<Team[] | undefined> = new BehaviorSubject<Team[]>(undefined);
  teams$: Observable<Team[]> = this.teams.asObservable();

  private scores: BehaviorSubject<Score[] | undefined> = new BehaviorSubject<Score[]>(undefined);
  scores$: Observable<Score[]> = this.scores.asObservable();

  private roster: BehaviorSubject<Array<Score[]>> = new BehaviorSubject<Array<Score[]>>(undefined);
  roster$: Observable<Array<Score[]>> = this.roster.asObservable();


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
  ) {
    this._sessions.detail$.subscribe((s) => {
      console.log("scores.session.detail$: ", s);

      if (s != undefined) {
        //  Scores 
        this.setScores(s.scores);

        //  Teams
        if (s.format != undefined && s.format['enum'].indexOf("team") > -1) {
          this.setTeams(s.scores);
        }
      }

    });


    //  Debug
    this.scores$.subscribe((s) => {
      console.log("scores$", s);
    });

    this.teams$.subscribe((t) => {
      console.log("teams$:", t);
    });

    this.roster$.subscribe((r) => {
      console.log("roster$:", r);
    });
  }

  getTeamsFromScoreList(scores): Team[] {
    if (scores != undefined) {
      var teamList = scores.map((s) => s.team);
      var unique = teamList.filter((e, i) => teamList.findIndex(a => a.name === e.name) === i);
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
    this.teams.value.forEach((v, i) => {
      if (team.name == v.name) {

        //  Update Availablity Status on Color
        this.teamColorList.find((c) => {
          if (c.name == team.name) {
            c.available = true;
            return true;
          }
        });
        
        var newList = this.teams.value.filter((ta, ti)=>{ return i != ti });
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
    this.scores.next(scores);
  }

  getRoster(team: Team): Score[] {
    if (team != null) {
      return this.scores.value.filter(scores => scores.team.name == team.name);
    } else {
      return this.scores.value;
    }

  }


  removeScore(score) {
    this._sessions.removeScore(score);
  }

}




export class Score {
  public id: string;
  public player: Player;
  public scores: Array<number>;
  public team: Team | null
  public handicap: number;

  constructor() { }
}

export class Team {
  constructor(
    public id: string,
    public name?: string,
    public color?: TeamColor,
    public hex?: string,
  ) { }
}

export class TeamColor {
  constructor(
    public name?: string,
    public hex?: string,
    public available?: boolean
  ) { }
}
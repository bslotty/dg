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
      

      if (s != undefined) {
        console.log('scores.session.detail$:', s);
        console.log("s.format: ", s.format);
        
        //  Scores 
        this.setScores(s.scores);



        //  Teams
        if (s.format != undefined) {

          console.log("s.format.enum: ", s.format['enum']);
          console.log("s.format.indexof: ", s.format['enum'].indexOf("team"));

          if (typeof s.format['enum'] == "string" && s.format['enum'].indexOf("team") > -1) {
            console.log('teams: ', s.scores);
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

    console.log('teamList:', teamList);

    this.teams.next(teamList);
    this.getTeamPlayers(teamList);
  }

  setScores(scores): void {
    this.scores.next(scores);
  }

  removeScore(score) {
    this._sessions.removeScore(score);
  }



  getRoster(team: Team): Score[] {
    console.log("this.scores.value: ", this.scores);

    if (team != undefined) {
      return this.scores.value.filter(scores => {

        if (scores.team != undefined) {
          return scores.team.name == team.name;
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
    console.log ("Update Team:", current, "to:", destination);
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
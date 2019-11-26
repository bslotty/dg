import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '../../account/services/backend.service';
import { SessionBackend, SessionFormat } from '../../sessions/services/backend.service';

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

  constructor(
    private _sessions: SessionBackend,
  ) {
    this._sessions.detail$.subscribe((s)=>{
      console.log ("scores.session.detail$: ", s);

      //  Teams
      if (s.format.enum.indexOf("team") > -1) {
        this.setTeams(s.scores);
      }

      //  Scores 
      this.setScores(s.scores);
    });


    //  Debug
    this.scores$.subscribe((s)=>{
      console.log ("scores$", s)
    });
  }

  getTeamsFromScoreList(scores):Team[] {
    //  Get Teams From Each Scores
    var teamList = scores.map((s)=>{
      return s.team;
    });
    console.log("teamList: ", teamList);


    var unique = teamList.filter((e, i) => teamList.findIndex(a => a.id === e.id) === i);
    console.log("unique: ", unique);
    return unique;
  }

  setTeams(scores): void {
    var teamList = this.getTeamsFromScoreList(scores);
    this.teams.next(teamList);
  }

  setScores(scores): void {
    this.scores.next(scores);
  }

  getRoster(team: Team): Score[] {
    if (team != null) {
      var list = this.scores.value.filter(scores => scores.team.name == team.name);
      console.log ("scores: ", list);
      return this.scores.value.filter(scores => scores.team.name == team.name);
    } else {
      return this.scores.value;
    }
    
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
    public color?: string,
    public hex?: string,
  ) { }
}
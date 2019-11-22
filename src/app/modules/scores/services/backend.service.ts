import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '../../account/services/backend.service';
import { SessionBackend } from '../../sessions/services/backend.service';

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
    });
  }

  getTeamsFromScoreList(scores):Team[] {
    var teamList = scores.filter()


    const uniqueArray = scores.filter((object,index) => index === scores.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));

    console.log ("unique: ", uniqueArray);
    return [];
  }

  setTeams(scores): void {
    var teamList = this.getTeamsFromScoreList(scores);
    this.teams.next(teamList);
  }

  setScores(scores): void {

    this.scores.next(scores);
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
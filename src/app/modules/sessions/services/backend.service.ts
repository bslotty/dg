import { League } from './../../leagues/services/backend.service';
import { AccountBackend, Player } from 'src/app/modules/account/services/backend.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { Course } from '../../courses/services/backend.service';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { pipe, BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../../stats/services/backend.service';

@Injectable({
  providedIn: 'root'
})
export class SessionBackend  {

  url: string = environment.apiUrl + '/controllers/sessions.php';

  serverPipe = pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  //  Generic
  private list: BehaviorSubject<Session[]> = new BehaviorSubject([]);
  list$: Observable<Session[]> = this.list.asObservable();
  
  /*
  //  Favorites
  private favoriteList: BehaviorSubject<Session[]> = new BehaviorSubject([]);
  favoriteList$: Observable<Session[]> = this.list.asObservable();

  //  Recient
  private recientList: BehaviorSubject<Session[]> = new BehaviorSubject([]);
  recientList$: Observable<Session[]> = this.list.asObservable();
  */

  public types = [
    {
      name: 'Free For All',
      enum: 'ffa',
      desc: `Every person for themselves! This is standard play.`,
    },{
      name: 'Teams: Sum',
      enum: 'team-sum',
      desc: `This format will combine the scores of each player on each team. Rankings will be sorted by the Team's Total Score.`,
    },{
      name: 'Teams: Average',
      enum: 'team-average',
      desc: `This format will average the throw totals of each player against par. Rankings will be sorted by the Team's Average Score.`,
    },{
      name: 'Teams: Best Only',
      enum: 'team-best',
      desc: `This format will only count the best score of each hole. Scores are set from the best scores of each hole.`,
    }
  ];



  constructor(
    private http: HttpClient,
    private account: AccountBackend,
  ) { }

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

  rGetData(res): Array<any> {
    var latest = res.length - 1;
    if (latest > -1) {
      return res[latest]["results"];
    } else {
      return [];
    }
  }



 

  //  Load Data List
  getList() {
    return this.http.post(this.url, { 
      "action": "list",

    }).pipe(
      map((res: ServerPayload) => {

        if (res.status == "success") {
          return res['sessions'];
          /*
          var result: Session[] = [];

          res.data["sessions"].forEach((session) => {
            var template = new Session(
              session.id,
              new Course(session.course.id, session.course.name),
              session.format,
              session.start,
              session.description,
              session.isDone,
              session.isStarted,
            );

            result.push(template);
          });
          

          return result;
          */
        } else {
          return [];
        }
      })
    )
  }

  getDetail(session: Session) {
    return this.http.post(this.url, { "session": session }).pipe(
      map((res: ServerPayload) => {
        return [];
      })
    );
  }



  create(session: Session) {
    return this.http.post(this.url, {
      "user": this.account.user,
      "session": session,
      "action": "create"
    }).pipe(
      map((res: ServerPayload) => {

        //  Return Server Response for Error Handling
        return res;
      })
    );

    
  }

  updateSession(league: League, session: Session) {
    let url = environment.apiUrl + "/sessions/update.php";
    return this.http.post(url, {
      "user": this.account.user,
      "league": league,
      "session": session,
    }).pipe(
      map((res: ServerPayload) => {
        //  Return Server Response for Error Handling
        return res;
      })
    );
  }

  delete(league: League, session: Session) {
    let url = environment.apiUrl + "/sessions/delete.php";
    return this.http.post(url, {
      "user": this.account.user,
      "league": league,
      "session": session,
    }).pipe(
      map((res: ServerPayload) => {

        //  Return Server Response for Error Handling
        return res;
      })
    );
  }

  setSessionFormat(league: League, session: Session) {
    let url = environment.apiUrl + "/sessions/setFormat.php";
    return this.http.post(url, {
      "user": this.account.user,
      "league": league,
      "session": session,
    }).pipe(
      map((res: ServerPayload) => {

        //  Return Server Response for Error Handling
        return res;
      })
    );
  }

  sortSession(list){
    //  Sort
    var sorted = list.sort((a, b) => {
      return b["start"] - a["start"];
    });

    return sorted;
  }

  convertSession(res) {
    var result = [];

    return result;
  }

  updateFormat(type) {
    console.log ("session.updateFormat: ", type);
  }
}


export class Session {
  constructor(
    public id?: string,
    public created_on?: Date,
    public created_by?: string, /* User? */
    public modified_on?: Date,
    public modified_by?: string, /* User? */
    public course?: Course,
    public format?: string,
    public starts_on?: Date,
    public title?: string,
    public par?: Array<any>,
    public scores?: Score[],
  ) { }
}

/*
export class SessionFormat {
  constructor(
    public name?: string,
    public enum?: string,
    public desc?: string
  ) { }
}

*/

export class Score {
  public id: string;
  public player: Player;
  public scores: Array<number>;
  public team: number; // Index of Team
  public handicap: number;

  constructor() {} 
}
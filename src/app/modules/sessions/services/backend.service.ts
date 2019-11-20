import { League } from './../../leagues/services/backend.service';
import { AccountBackend, Player } from 'src/app/modules/account/services/backend.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { Course } from '../../courses/services/backend.service';
import { map, debounceTime, distinctUntilChanged, catchError, takeWhile } from 'rxjs/operators';
import { pipe, BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HelperService } from 'src/app/shared/services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class SessionBackend {

  url: string = environment.apiUrl + '/controllers/sessions.php';

  serverPipe = pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  //  Generic
  private list: BehaviorSubject<Session[]> = new BehaviorSubject([]);
  list$: Observable<Session[]> = this.list.asObservable();

  //  Favorites
  private favoriteList: BehaviorSubject<Session[]> = new BehaviorSubject([]);
  favoriteList$: Observable<Session[]> = this.list.asObservable();

  //  Single View
  private detail: Subject<Session> = new Subject();
  detail$: Observable<Session> = this.detail.asObservable().pipe(map((d) => {
    console.log("detailSet: ", d);
    return d;
  }));

  //  Session Modes
  public types:SessionFormat[] = [
    {
      name: 'Free For All',
      enum: 'ffa',
      desc: `Every person for themselves! This is standard play.`,
    }, {
      name: 'Teams: Sum',
      enum: 'team-sum',
      desc: `This format will combine the scores of each player on each team. Rankings will be sorted by the Team's Total Score.`,
    }, {
      name: 'Teams: Average',
      enum: 'team-average',
      desc: `This format will average the throw totals of each player against par. Rankings will be sorted by the Team's Average Score.`,
    }, {
      name: 'Teams: Best Only',
      enum: 'team-best',
      desc: `This format will only count the best score of each hole. Scores are set from the best scores of each hole.`,
    }
  ];



  constructor(
    private http: HttpClient,
    private helper: HelperService,
    private account: AccountBackend,
  ) { }


  convertProperties(res) {
    var result: Session[] = [];

    this.helper.rGetData(res).forEach((session) => {
      result.push(new Session(
        session['id'],
        session['created_on'],
        session['created_by'],
        session['modified_on'],
        session['modified_by'],
        session['course'],
        session['format'],
        session['starts_on'],
        session['title'],
        session['par'],
        session['scores'],
      ));
    });

    return result;
  }



  listFavorites() {
    this.getList("favorites").subscribe((courses: Session[]) => {
      console.log("courses.favorites: ", courses);
      this.favoriteList.next(courses);
    });
  };

  listRecient() {
    this.getList("list").subscribe((courses: Session[]) => {
      console.log("courses.recient: ", courses);
      this.list.next(courses);
    });
  }


  getList(list: string, start: number = 0, limit: number = 100) {
    return this.http.post(this.url, {
      "action": list,
      "start": start,
      "limit": limit,
      "user": this.account.user
    }).pipe(this.serverPipe,
      map((res) => {
        console.log("res: ", res);

        if (this.helper.rCheck(res)) {
          return this.convertProperties(res);
        } else {
          return [];
        }
      }),
      catchError(
        (error) => of(`Bad Request ${error}`)
      )
    );
  }



  getDetail(session: Session): void {

    //  Just Grab All info from the server for the specific details; Other information may not be available; fix;
    this.http.post(this.url, {
      "action": "detail",
      "session": session,
      "user": this.account.user
    }).pipe().subscribe((res) => {
      if (this.helper.rCheck(res)) {

        var session = this.convertProperties(res)[0];
        console.log("session.getDetail: ", session);
        
        this.detail.next(session);
      } else {
        console.log ("Error with server Response: ", res);
      }
    });
  }



  create(session: Session) {
    return this.http.post(this.url, {
      "user": this.account.user,
      "session": session,
      "action": "create"
    }).pipe(
      map((res: ServerPayload) => {
        if (this.helper.rCheck(res)) {
          console.log("create.res: ", res);
          this.detail.next(this.convertProperties(res)[0]);
        }
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
  
  convertSession(session) {

  }

  /*  MFD
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
  */



  sortSession(list) {
    //  Sort
    var sorted = list.sort((a, b) => {
      return b["start"] - a["start"];
    });

    return sorted;
  }


  setSessionFromID(sessionId): void {
    console.log("setSessionFromID: ", sessionId);

    //  Search List for Match
    var session = this.list.value.find((v, i) => {
      return v.id = sessionId;
    });

    if (session != undefined) {

      //  Emit new session detail 
      this.detail.next(session);
    } else {

      //  Get Data From server if not found;
      var session = new Session();
      session.id = sessionId;
      this.getDetail(sessionId);
    }
  }


  //  Gonna have to move this to a new service; URL conflicts;
  getScores() {
    
  }


  /*  MFD
  convertSession(res) {
    var result = [];

    return result;
  }

  updateFormat(type) {
    console.log ("session.updateFormat: ", type);
  }
  */
}

export class SessionFormat {
  name: string;
  enum: string;
  desc: string;
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




export class Score {
  public id: string;
  public player: Player;
  public scores: Array<number>;
  public team: string; // Index of Team
  public handicap: number;

  constructor() { }
}

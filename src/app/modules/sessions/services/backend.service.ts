import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { map, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { pipe, BehaviorSubject, Observable, of } from 'rxjs';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Session, Player, SessionFormat } from 'src/app/shared/types';


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
  private detail: BehaviorSubject<Session> = new BehaviorSubject(new Session());
  detail$: Observable<Session> = this.detail.asObservable();


  
  //  Recient Players
  private recientPlayers: BehaviorSubject<Player[]> = new BehaviorSubject([])
  recientPlayers$: Observable<Player[]> = this.recientPlayers.asObservable();

  //  Searched Players
  private searchedPlayers: BehaviorSubject<Player[]> = new BehaviorSubject([])
  searchedPlayers$: Observable<Player[]> = this.searchedPlayers.asObservable();


  //  Session Modes
  public types: SessionFormat[] = this.helper.types;

  public admin: boolean = false;


  constructor(
    private http: HttpClient,
    private helper: HelperService,
    private account: AccountBackend,
  ) {
    this.detail$.subscribe((d) => {
      // Verify Detail Valid;

      //  Update if ID / Create If Not
      if (this.account.user && d.created_by == this.account.user.id) {
        this.admin = true;
      }
    });
  }


  ReadyForSubmission() {
    return true;
  }

  /** Take Format String and Convert to :SessionFormat
   * 
   */
  convertFormatStr(str) {
    return this.types.find(t => t.enum == str);
  }

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
        this.convertFormatStr(session['format']),
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
      this.favoriteList.next(courses);
    });
  };

  listRecient() {
    this.getList("list").subscribe((courses: Session[]) => {
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
        console.log("Error with server Response: ", res);
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

  updateSession(session: Session) {
    return this.http.post(this.url, {
      "user": this.account.user,
      "session": session,
      "action": "update",
    }).pipe(
      map((res: ServerPayload) => {
        //  Return Server Response for Error Handling
        return res;
      })
    );
  }



  delete(session: Session) {
      this.http.post(this.url, {
        "action": "delete",
        "session": session,
        "user": this.account.user
      }).subscribe((res) => {
        console.log("Delete.res: ", res);
      });
  }


  sortSession(list) {
    //  Sort
    var sorted = list.sort((a, b) => {
      return b["start"] - a["start"];
    });

    return sorted;
  }

  resetDetail() {
    this.detail.next(new Session());
    console.log("session.detail reset: ", this.detail.value);
  }


  setSessionFromID(sessionId): void {

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

  setFormat(format) {
    this.detail.value.format = format;
    this.detail.next(this.detail.value);
  }

  setCourse(course) {
    this.detail.value.course = course;
    this.detail.next(this.detail.value);
  }

  setDate(date: Date, time: string): void {
    var d = new Date(date.toDateString() + " " + time);
    this.detail.value.starts_on = d;
    this.detail.next(this.detail.value);
  }





  addScore(score) {
    if (this.detail.value.scores == undefined) {
      this.detail.value.scores = [score];
    } else {

      var dupe = this.detail.value.scores.find(e => e.player.id == score.player.id);

      if (dupe == undefined) {
        this.detail.value.scores.push(score);
      }
    }

    this.detail.next(this.detail.value);
  }

  removeScore(score) {
    this.detail.value.scores = this.detail.value.scores.filter(s => s.player.id != score.player.id);
    this.detail.next(this.detail.value);
  }

  getScore(score): boolean {
    return this.detail.value.scores != undefined && this.detail.value.scores.find(s => s.player.id == score.player.id) != undefined;
  }




  clearRoster(team) {
    this.detail.value.scores.forEach((s, i) => {
      if (s.team == team) {
        s.team = null;
      }
    });
  }

  addTeam(team) {

  }

  removeTeam(team) {
    console.error("RemoveTeam: ", team);
    this.detail.value.scores = this.detail.value.scores.filter(s => s.team == team.name);
  }

  teamGame(): boolean {
    if (this.detail.value.format != undefined) {
      var res: boolean = typeof this.detail.value.format != undefined && this.detail.value.format.enum != 'ffa';
      return res;
    } else {
      return false;
    }
  }

}
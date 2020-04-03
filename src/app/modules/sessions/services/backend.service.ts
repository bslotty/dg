import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { pipe, BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Session, Player, SessionFormat } from 'src/app/shared/types';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, find } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SessionBackend {

  url: string = environment.apiUrl + '/controllers/sessions.php';

  //  Generic
  private recient: BehaviorSubject<Session[]> = new BehaviorSubject([]);
  recient$: Observable<Session[]> = this.recient.asObservable();

  //  Generic
  private upcoming: BehaviorSubject<Session[]> = new BehaviorSubject([]);
  upcoming$: Observable<Session[]> = this.upcoming.asObservable();

  //  Favorites
  private favoriteList: Subject<Session[]> = new Subject();
  favoriteList$: Observable<Session[]> = this.upcoming.asObservable();

  //  Single View
  private detail: BehaviorSubject<Session> = new BehaviorSubject(new Session());
  detail$: Observable<Session> = this.detail.asObservable();


  public admin: boolean = false;


  constructor(
    private http: HttpClient,
    private helper: HelperService,
    private account: AccountBackend,
    private route: ActivatedRoute,
  ) {
    this.detail$.subscribe((d) => {
      // Verify Detail Valid;
      console.log("session.detail: ", d);

      //  Update if ID / Create If Not
      if (this.account.user && d.created_by == this.account.user.id) {
        this.admin = true;
      }
    });

  }

  //  Take a form, and verify that it is valid;
  ReadyForSubmission() {
    return true;
  }


  listFavorites() {
    this.getList("favorites").subscribe((res: ServerPayload[]) => {

      this.favoriteList.next(this.helper.rGetData(res));
    });
  };


  listCurrentSessions() {
    this.getList("list").subscribe((res: ServerPayload[]) => {

      let sessions = this.helper.rGetData(res);

      //  console.log("sessions: ", sessions);

      var d = new Date().getTime();
      let recient = sessions.filter((s: Session) => d > s.starts_on.getTime());
      this.recient.next(recient);

      //  Get Upcoming; Sort by soonest; Limit 5
      let upcoming = sessions.filter((s: Session) => d < s.starts_on.getTime());
      this.upcoming.next(upcoming);

    });
  }


  getList(list: string, start: number = 0, limit: number = 100) {
    return this.http.post(this.url, {
      "action": list,
      "start": start,
      "limit": limit,
      "user": this.account.user
    });
  }

  findDetails(session_id) {
    console.log ("Searching For: ", session_id);

    let session:Session = new Session();
    session.id = session_id;
    

    //  Find Session in Upcoming & Recient Lists;
    //  If Found; Set details$ to matching session
    //  if !Found; getDetail to get from server
    //  if ServerRes Ok; Set details$


    //  Search List for Match
    let found = false;
    let upcoming = this.upcoming.value.find((v, i) => {
      return v.id = session.id;
    });
    if (upcoming != undefined) {
      session = upcoming;
      found = true;
    }

    let recient = this.recient.value.find((v, i) => {
      return v.id = session.id;
    });
    if (upcoming != undefined) {
      session = recient;
      found = true;
    }


    console.log("upcoming: ", upcoming);
    console.log("recient: ", recient);


    if (found) {
      console.log("session found from lists!");
      this.detail.next(session);

    } else {
      this.getDetail(session).subscribe((res: ServerPayload[]) =>{
        let session = this.helper.rGetData(res)[0];
        if (session != undefined) {
          console.log("session retrieved from server!");
          this.detail.next(session);
        } else {
          console.warn("Unable to find session.", session);
        }
        
      });
    }
  }

  getDetail(session: Session) {
    return this.http.post(this.url, {
      "action": "detail",
      "session": session,
      "user": this.account.user
    }).pipe();
  }

  
  resetDetails() {
    let session = new Session(
      "create",
      new Date(),
      this.account.user.id,
      null,
      null,
      null,
      this.helper.types[0],
      null,
      null, 
      [],
      []
    );

    this.detail.next(session);
  }

  //  MOD
  setupNewSession() {
    let session: Session;

    //  Get URL Path
    let guid = this.route.snapshot.paramMap.get("session");
    console.log("guid", guid);

    //  If Null -> Create Default Session
    //  If !Null -> Get From List
    //  If !Found -> Get From Server

    if (guid == null) {
      session = new Session(
        "create",
        new Date(),
        this.account.user.id,
        null,
        null,
        null,
        this.helper.types[0],
        null,
        null, 
        [],
        []
      )
    } else {

    }

    return session;
  }



  create(session: Session) {
    return this.http.post(this.url, {
      "user": this.account.user,
      "session": session,
      "action": "create"
    }).pipe();


  }

  updateSession(session: Session) {
    return this.http.post(this.url, {
      "user": this.account.user,
      "session": session,
      "action": "update",
    }).pipe();
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





/**
 *    Add Save Feature Here
 */
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


  /*
  validateRoster(): boolean {
    var valid = true;
    this.scoreList.controls.forEach((s) => {
      if (s.value.team == null || s.value.team == undefined || s.value.team.name == "unassigned") {
        valid = false;
      }
    });
    return valid;
  }
  */


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
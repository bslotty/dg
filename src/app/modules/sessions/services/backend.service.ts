import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { pipe, BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Session, Player, SessionFormat, Score } from 'src/app/shared/types';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap, find } from 'rxjs/operators';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';


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


  constructor(
    private http: HttpClient,
    private helper: HelperService,
    private account: AccountBackend,
    private route: ActivatedRoute,
    private router: Router,
    private feed: FeedbackService,
  ) { }

  /*

    HTTP
  */
  // List
  getList(list: string, start: number = 0, limit: number = 100) {
    return this.http.post(this.url, {
      "action": list,
      "start": start,
      "limit": limit,
      "user": this.account.user
    });
  }

  //  Single
  getDetail(session: Session) {
    return this.http.post(this.url, {
      "action": "detail",
      "session": session,
      "user": this.account.user
    });
  }

  //  Create
  create(session: Session) {
    return this.http.post(this.url, {
      "user": this.account.user,
      "session": session,
      "action": "create"
    });


  }

  //  Update
  updateSession() {
    return this.http.post(this.url, {
      "action": "update",
      "user": this.account.user,
      "session": this.detail.value,
    });
  }

  //  Delete
  deleteSession() {
    return this.http.post(this.url, {
      "action": "delete",
      "user": this.account.user,
      "session": this.detail.value
    });
  }






  //  Verification
  validateSubmission() {
    const session = this.detail.value;
    let valid = true;

    //  Course?
    if (session.course == undefined) {
      valid = false;
      this.feed.setError("session-course", "Select a Course");
    }

    //  Time?
    if (session.starts_on == undefined) {
      valid = false;
      this.feed.setError("session-start", "Invalid Start Date");
    }

    //  Format?
    if (session.format == undefined) {
      valid = false;
      this.feed.setError("session-format", "This should never fire.");
    }

    //  Players?
    if (session.scores.length == 0) {
      valid = false;
      this.feed.setError("session-scores", "Add Players to the Match");
    } else {

      //  Teams?
      if (session.format != undefined && session.format.enum != "ffa") {

        //  Verify no one on Unassigned
        let unassignedTeam = session.scores.filter((score) => {
          return score.team.name == "Unassigned";
        });

        if (unassignedTeam.length > 0) {
          valid = false;
          this.feed.setError("session-teams", "All Players need to be assigned to a team");
        }
      }

    }

    return valid;
  }

  submitCreation() {
    if (this.validateSubmission()) {
      console.log("session.create: ", this.detail.value);

      this.create(this.detail.value).subscribe((res) => {
        //  console.log("session.create.res:", this.helper.rGetData(res), res);

        //  Toast

        let session = this.helper.rGetData(res)[0];
        this.router.navigate(["/sessions", session['id']]);
      });
    }
  }

  confirmDelete() {
    this.deleteSession().subscribe((res: ServerPayload[]) => {
      console.warn("session.deleted: ", res);

      if (res[res.length - 1]['status'] == 'success') {
        this.router.navigate(["/sessions"]);
      } else {
        //  Error FeedBack

      }
    });
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






  findDetails(session_id) {
    console.log("Searching For: ", session_id);

    let session: Session = new Session();
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
    if (recient != undefined) {
      session = recient;
      found = true;
    }


    console.log("upcoming: ", upcoming);
    console.log("recient: ", recient);
    console.log("found: ", found);


    //  *************
    //  Force Retrieval from server.. Course/Scores/Teams Unavailable from lists. Would need to retrieve anyway.
    found = false;

    if (found) {
      console.log("session found from lists!");
      this.detail.next(session);

    } else {
      this.getDetail(session).subscribe((res: ServerPayload[]) => {
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

  setScores(scores: Score[]) {
    this.detail.value.scores = scores;
    this.detail.next(this.detail.value);
  }

  //  Get Each

  



  //  Status Functions
  admin(): boolean {
    let admin = this.account.user && this.detail.value.created_by == this.account.user.id;
    if (admin) {
      return true;
    } else {
      return false;
    }
  }


  teamGame(): boolean {
    if (this.detail.value.format != undefined) {
      var res: boolean = this.detail.value.format.enum != 'ffa';
      return res;
    } else {
      return false;
    }
  }

  hasId(): boolean {
    return this.detail.value.id != "create";
  }

  hasStarted(): boolean {
    //  If scores are entered, session is considered started.
    let started = false;

    //  check each player
    this.detail.value.scores.forEach((s) => {

      //  check each attempt; return non 0s
      if (s.throws != null) {
        let changed = s.throws.filter(t => t != 0);

        //  update flags
        if (changed.length > 0 && s.throws.length > 0) {
          started = true;
        }
      }


    });

    return started;
  }


}
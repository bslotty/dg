import { League } from './../../leagues/services/backend.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { Course } from '../../courses/services/backend.service';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { pipe, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionBackend  {

  url: string = environment.apiUrl + '/controllers/courses.php';

  serverPipe = pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  //  Generic
  private list: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  list$: Observable<Course[]> = this.list.asObservable();
  
  //  Favorites
  private favoriteList: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  favoriteList$: Observable<Course[]> = this.list.asObservable();

  //  Recient
  private recientList: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  recientList$: Observable<Course[]> = this.list.asObservable();

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
  getList(league: League) {
    let url =  "/sessions/list.php";

    return this.http.post(url, { "league": league }).pipe(
      map((res: ServerPayload) => {

        if (res.status == "success") {
          return res.data['sessions'];
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
    let url = environment.apiUrl + "/sessions/detail.php";
    return this.http.post(url, { "session": session }).pipe(
      map((res: ServerPayload) => {

        if (res.status == "success") {
          session = new Session(
            res.data["session"]["id"],
            new Course(res.data["course"]["id"], res.data["course"]["name"]),
            res.data["session"]["format"],
            res.data["session"]["start"],
            res.data["session"]["description"],
            res.data["session"]["isDone"],
            res.data["session"]["isStarted"],
            JSON.parse(res.data["session"]["par"]),
          );

          return session;
        } else {
          return [];
        }
      })
    );
  }



  createSession(league: League, session: Session) {
    let url = environment.apiUrl + "/sessions/create.php";
    return this.http.post(url, {
      "user": this.account.user,
      "league": league,
      "session": session,
    }).pipe(
      map((res: ServerPayload) => {
        //  Update Data Store
        this.getList(league);

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
        //  Update Data Store
        this.getList(league);

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
        //  Update Data Store
        this.getList(league);

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
        //  Update Data Store
        this.getList(league);

        //  Return Server Response for Error Handling
        return res;
      })
    );
  }
}


export class Session {
  constructor(
    public id: string,
    public course?: Course,
    public format?: string,
    public start?: Date,
    public description?: string,
    public isDone?: number,
    public isStarted?: number,
    public par?: Array<any>,
  ) { }
}
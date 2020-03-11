import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { map, catchError, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { of, pipe, BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountBackend } from '../../account/services/backend.service';
import { Course } from 'src/app/shared/types';

@Injectable({
  providedIn: 'root'
})
export class CourseBackend {

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
  favoriteList$: Observable<Course[]> = this.favoriteList.asObservable();

  //  Recient
  private recientList: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  recientList$: Observable<Course[]> = this.recientList.asObservable();

  //  Search
  private search: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  search$: Observable<Course[]> = this.search.asObservable();

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

  /**
   * @param ServerPayload res Subscription Response
   * @returns data results of request;
   */
  rGetData(res): Array<any> {
    var latest = res.length - 1;
    if (latest > -1) {
      return res[latest]["results"];
    } else {
      return [];
    }
    
  }

  listFavorites(){
    this.getList("favorites").subscribe((courses:Course[])=>{
      this.favoriteList.next(courses);
    });
  };

  listRecient(){
    this.getList("recient").subscribe((courses:Course[])=>{
      this.recientList.next(courses);
    });
  }

  listTop() {
    this.getList("list").subscribe((courses:Course[]) => {
      this.list.next(courses);
    });
  }

  //  SearchList?


  getList(list: string, start: number = 0, limit: number = 20) {
    return this.http.post(this.url, { 
      "action": list,
      "start": start,
      "limit": limit,
      "user" : this.account.user
    }).pipe(this.serverPipe,
      map((res) => {
        if (this.rCheck(res)) {
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

  

  getDetail(course: Course) {
    let url = environment.apiUrl + "/courses/detail.php";
    return this.http.post(url, { course: course }).pipe(map((res: ServerPayload) => {
      if (this.rCheck(res)) {
        this.list.next(this.helper.covertCourse(res));
      } else {
        this.list.next([]);
      }
    }));
  }

  getSearch(term: string) {
    this.http.post(this.url, { action: "search", term: term }).pipe(this.serverPipe).subscribe((res: ServerPayload) => {
      if (this.rCheck(res)) {
        this.search.next(this.helper.covertCourse(res));
      } else {
        this.search.next([]);
      }
    });
  }

  create(course) {
    console.log ("User: ", this.account.user);
    return this.http.post(this.url, { 
      action: 'create',
      course: course, 
      user: this.account.user 
    });
  }


  setCourseList(courses: Course[]) {
    this.list.next(courses);
  }

  resetList() {
    this.list.next([]);
  }
}
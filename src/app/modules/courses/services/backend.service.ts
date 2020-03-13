import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { map, catchError, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { of, pipe, BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountBackend } from '../../account/services/backend.service';
import { Course } from 'src/app/shared/types';
import { HelperService } from 'src/app/shared/services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class CourseBackend {

  url: string = environment.apiUrl + '/controllers/courses.php';

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
    private helper: HelperService,
  ) { }


  listFavorites() {
    this.getList("favorites").subscribe((courses: Course[]) => {
      this.favoriteList.next(courses);
    });
  };

  listRecient() {
    this.getList("recient").subscribe((courses: Course[]) => {
      this.recientList.next(courses);
    });
  }

  listTop() {
    this.getList("list").subscribe((courses: Course[]) => {
      this.list.next(courses);
    }, (e) => {
      console.log("error: ", e);
    });
  }


  getList(list: string, start: number = 0, limit: number = 20) {
    return this.http
      .post(this.url, {
        "action": list,
        "start": start,
        "limit": limit,
        "user": this.account.user
      }).pipe(this.helper.pipe, this.helper.errorPipe);
  }



  getDetail(course: Course) {
    let url = environment.apiUrl + "/courses/detail.php";
    return this.http.post(url, { course: course }).pipe(map((res: ServerPayload) => {
      this.list.next(this.helper.convertCourse(res));
    }));
  }

  getSearch(term: string) {
    this.http.post(this.url, { action: "search", term: term }).pipe(this.helper.pipe).subscribe((res: ServerPayload) => {
      this.search.next(this.helper.convertCourse(res));
    });
  }

  create(course) {
    console.log("User: ", this.account.user);
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
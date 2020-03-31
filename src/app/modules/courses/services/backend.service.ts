import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { of, pipe, BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountBackend } from '../../account/services/backend.service';
import { Course, ServerPayload } from 'src/app/shared/types';
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

  listTop() {
    this.getList("list").subscribe((res: ServerPayload[]) => {
      this.list.next(this.helper.rGetData(res));
    });
  }

  listRecient() {
    this.getList("recient").subscribe((res: ServerPayload[]) => {
      this.recientList.next(this.helper.rGetData(res));
    });
  }


  listFavorites() {
    this.getList("favorites").subscribe((res: ServerPayload[]) => {
      this.favoriteList.next(this.helper.rGetData(res));
    });
  };





  getList(list: string, start: number = 0, limit: number = 20) {
    return this.http
      .post(this.url, {
        "action": list,
        "start": start,
        "limit": limit,
        "user": this.account.user
      }).pipe();
  }



  getDetail(course: Course) {
    let url = environment.apiUrl + "/courses/detail.php";
    return this.http.post(url, { course: course }).pipe(map((res: ServerPayload) => {
      this.list.next(this.helper.rGetData(res));
    }));
  }

  getSearch(term: string) {
    this.http.post(this.url, { action: "search", term: term }).pipe(this.helper.pipe).subscribe((res: ServerPayload) => {
      this.search.next(this.helper.rGetData(res));
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
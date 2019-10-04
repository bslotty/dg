import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { map, catchError, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { of, pipe, BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseBackend {

  url: string = environment.apiUrl + '/controllers/courses.php';

  serverPipe = pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  private list: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  list$: Observable<Course[]> = this.list.asObservable();


  constructor(
    private http: HttpClient,
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

  getList(sort: string) {
    return this.http.post(this.url, { "action": "list", "sort": sort }).pipe(this.serverPipe,
      map((res: ServerPayload) => {
        if (res.status == "success") {
          var result: Course[] = [];

          res.data["courses"].forEach((course) => {
            result.push(new Course(
              course['id'],
              course['parkName'],
              course['city'],
              course['state'],
              course['zip'],
              +course['lat'],
              +course['lng'],
            ))
          });
          //this.list$.next(result);
          return result;
        } else {
          //this.list$.next([]);
          return [];
        }
      }),
      catchError(
        (error) => of(`Bad Request ${error}`)
      )
    );
  }

  genList(sort: string = "asc") {
    this.getList(sort).subscribe((courses) => {
      return courses;
    });
  }

  getDetail(course: Course) {
    let url = environment.apiUrl + "/courses/detail.php";
    return this.http.post(url, { course: course }).pipe(
      map((res: ServerPayload) => {
        var result: Course;
        if (res.status == "success") {
          var course = res["data"]["course"];

          result = new Course(
            course['id'],
            course['parkName'],
            course['city'],
            course['state'],
            course['zip'],
            +course['lat'],
            +course['lng']
          );

          return result;
        } else {
          return [];
        }
      })
    );
  }

  search(term: string) {
    this.http.post(this.url, { action: "search", term: term }).pipe(this.serverPipe).subscribe((res: ServerPayload) => {


      if (this.rCheck(res)) {
        var result: Course[] = [];

        /*
        res.data["courses"].forEach((course) => {
          result.push(new Course(
            course['id'],
            course['name'],
            course['parkName'],
            course['location'],
            course['img'],
            course['city'],
            course['state'],
            course['zip'],
            +course['lat'],
            +course['lng'],
          ))
        });
        */


        this.list.next(res["data"][0]["results"]);
      } else {
        this.list.next([]);
      }
    });
  }

}


export class Course {
  constructor(
    public id?: string,
    public parkName?: string,
    public city?: string,
    public state?: string,
    public zip?: string,
    public lat?: number,
    public lng?: number,
  ) { }
}
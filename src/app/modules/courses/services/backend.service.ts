import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { map, catchError, timeout, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { of, pipe, BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseBackend {

  private serverPipe = pipe(
    debounceTime(5000),
    distinctUntilChanged(),
  );

  list$: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  /*  Error handling
    Timeout
    HTTP Error
      4**
      5**
  */

  constructor(
    private http: HttpClient,
  ) { }

  getList(sort: string) {
    let url = environment.apiUrl + "/courses/list.php";
    return this.http.post(url, {"sort": sort}).pipe(this.serverPipe, 
      map((res: ServerPayload) => {
        if (res.status == "success") {
          var result:Course[] = [];

          res.data["courses"].forEach((course)=>{
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
              course['difficulty'],
              course['holeCount'],
            ))
          });
          this.list$.next(result);
          return result;
        } else {
          this.list$.next([]);
          return [];
        }
      }),
      catchError(
        (error)=> of(`Bad Request ${error}`)
      )
    );
  }

  genList(sort: string = "asc") {
    this.getList(sort).subscribe((courses)=>{
      return courses;
    });
  }

  getDetail(course: Course) {
    let url = environment.apiUrl + "/courses/detail.php";
    return this.http.post(url, {course: course}).pipe(
      map((res: ServerPayload)=>{
        var result: Course;
        if (res.status == "success") {
          var course = res["data"]["course"];

          result = new Course(
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
            course['difficulty'],
            course['holeCount'],
          );

          return result;
        } else {
          return [];
        }
      })
    );
  }

  search(term: string) {
    let url = environment.apiUrl + "/courses/search.php";
    return this.http.post(url, {term: term}).pipe(this.serverPipe, 
      map((res: ServerPayload) => {
        if (res.status == "success") {
          var result:Course[] = [];

          res.data["courses"].forEach((course)=>{
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
              course['difficulty'],
              course['holes'],
            ))
          });
          return result;
        } else {
          return [];
        }
      }),
      catchError(
        (error)=> of(`Bad Request ${error}`)
      )
    );
  }

}


export class Course {
  constructor(
      public id: string,
      public name?: string,
      public parkName?: string,
      public location?: string,
      public img?: string,
      public city?: string,
      public state?: string,
      public zip?: string,
      public lat?: number,
      public lng?: number,
      public difficulty?: string,
      public holes?: string,
  ){ }
}
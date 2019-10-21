import { Component, OnInit } from '@angular/core';
import { Course, CourseBackend } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  recientCourses: Course[];
  favoriteCourses: Course[];
  topCourses: Course[];

  constructor(
    private feed: FeedbackService,
    private courses: CourseBackend,
    private account: AccountBackend,

  ) { }

  ngOnInit() {

    this.courses.list$.subscribe((courses) => {
      console.log("courses: ", courses);
      if (courses.length > 0) {
        console.log("list$.courses: ", courses);
        this.topCourses = courses;
        this.feed.loading = false;
      }

    });

    if (this.topCourses == undefined) {
      this.courses.listTop();
    }

    if (this.account.user) {
      if (this.favoriteCourses == undefined) {
        this.courses.listFavorites();
      }

      if (this.recientCourses == undefined) {
        this.courses.listRecient();
      }
    }
  }

}

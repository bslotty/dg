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

    //  Subscribe to lists
    this.courses.list$.subscribe((courses) => {
      this.topCourses = courses;
      this.feed.loading = false;
    });

    //  Populate Lists
    if (this.topCourses == undefined) {
      this.courses.listTop();
    }


    //  Account Required Lists
    if (this.account.user) {

      //  Subscribe to Account Linked Lists
      this.courses.favoriteList$.subscribe((courses)=>{
        this.favoriteCourses = courses;
        this.feed.loading = false;
      });
      
      this.courses.recientList$.subscribe((courses)=>{
        this.favoriteCourses = courses;
        this.feed.loading = false;
      });

      //  Populate Account Linked Lists
      if (this.favoriteCourses == undefined) {
        this.courses.listFavorites();
      }

      if (this.recientCourses == undefined) {
        this.courses.listRecient();
      }
    }
  }

}

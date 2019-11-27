import { Component, OnInit } from '@angular/core';
import { Course, CourseBackend } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { Observable } from 'rxjs';
import { flyIn } from 'src/app/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [flyIn]
})
export class DashboardComponent implements OnInit {

  topCourses: Observable<Course[]>;

  recientCourses: Course[];
  favoriteCourses: Course[];
  

  constructor(
    private feed: FeedbackService,
    private courses: CourseBackend,
    private account: AccountBackend,

  ) { }

  ngOnInit() {
    //  Populate Lists
    this.courses.listTop();

    //  Subscribe to lists
    this.topCourses = this.courses.list$;

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

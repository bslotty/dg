import { Component, OnInit } from '@angular/core';
import { Course, CourseBackend } from '../../services/backend.service';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { Observable } from 'rxjs';
import { flyIn } from 'src/app/animations';
import { CourseFormService } from '../../services/course-form.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [flyIn]
})
export class DashboardComponent implements OnInit {

  topCourses: Observable<Course[]>;
  recientCourses: Observable<Course[]>;
  favoriteCourses: Observable<Course[]>;
  searchCourses: Observable<Course[]>;
  
  lists: Array<listCategories> = [
    {
      name: "top",
      list: this.topCourses
    }, {
      name: "recient",
      list: this.recientCourses,
    }, {
      name: "favorite",
      list: this.favoriteCourses
    }, {
      name: "search",
      list: this.searchCourses,
    }
  ];

  search: boolean = false;
  form: FormGroup;

  constructor(
    private feed: FeedbackService,
    private courses: CourseBackend,
    private coursesForm: CourseFormService,
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
      this.favoriteCourses  = this.courses.favoriteList$;
      this.recientCourses   = this.courses.recientList$;

      //  Populate Account Linked Lists
      if (this.favoriteCourses == undefined) {
        this.courses.listFavorites();
      }

      if (this.recientCourses == undefined) {
        this.courses.listRecient();
      }
    }


    
    //  Setup Form
    this.coursesForm.Setup('search');
    this.coursesForm.form$.subscribe((f)=>{
      this.form = f;
    });
  }

  toggleSearch(){
    this.search = !this.search;
  }

}


export interface listCategories {
  name: string;
  list: Observable<Object[]>;
}

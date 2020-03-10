import { Component, OnInit } from '@angular/core';
import { CourseBackend } from '../../services/backend.service';
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

  lists: Array<listCategories>;
  selectedList: listCategories;

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

    //  Account Required Lists
    if (this.account.user) {
      this.courses.listFavorites();
      this.courses.listRecient();
    }

    //  List Selection
    this.lists = [
      {
        name: "top",
        obs: this.courses.list$,
      }, {
        name: "recient",
        obs: this.courses.recientList$,
      }, {
        name: "favorites",
        obs: this.courses.favoriteList$,
      }, {
        name: "search",
        obs: this.courses.search$,
      }
    ];

    //  Default Option
    this.selectedList = this.lists[0];


    //  Setup Form
    this.coursesForm.Setup('search');
    this.coursesForm.form$.subscribe((f) => {
      this.form = f;
      this.feed.loading = false;
    });
  }

  toggleSearch() {
    this.search = !this.search;

    if (this.search) {
      //  Set Dropdown to Search
      this.selectedList = this.lists.find((l) => {
        return l.name == "search";
      });


      //  Clear Field
      this.coursesForm.resetSearch();
    } else {

      //  Reset;
      this.feed.loading = false;
      this.selectedList = this.lists[0];
    }
  }

  selectChange($event) {
    this.selectedList = this.lists.find((l) => {
      return l.name == $event.value.name;
    });

    if ($event.value.name != 'search' && this.search) {
      this.toggleSearch();
    }
  }

}


export interface listCategories {
  name: string;
  obs: Observable<Object[]>;
}

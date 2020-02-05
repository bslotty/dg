import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { flyIn } from 'src/app/animations';
import { Course, CourseBackend } from '../../services/backend.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { FormGroup } from '@angular/forms';
import { CourseFormService } from '../../services/course-form.service';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';


@Component({
  selector: 'app-course-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [flyIn],
})
export class ListComponent implements OnInit {

  @Input() type: string = "top"; // recient | favorites | ...
  @Input() mode: string[] = ["link"];

  list$: Observable<Course[]>;


  lists: Array<listCategories>;
  selectedList: listCategories;

  search: boolean = false;
  form: FormGroup;


  constructor(
    private _course: CourseBackend,
    private _courseForm: CourseFormService,
    private _account: AccountBackend,
    private feed: FeedbackService,
  ) { }

  /*
  ngOnInit() {
    switch (this.type.toLowerCase()) {
      case 'top':
        this._course.listTop();
        this.list$ = this._course.list$;
        break;

      case 'recient':
        this._course.listRecient();
        this.list$ = this._course.recientList$;
        break;

      case 'favorites':
        this._course.listFavorites();
        this.list$ = this._course.favoriteList$;
        break;

      default:
        console.warn("Invalid Course List Type: ", this.type);
        break;
    }
    */

  ngOnInit() {
    //  Populate Lists
    this._course.listTop();

    //  Account Required Lists
    if (this._account.user) {
      this._course.listFavorites();
      this._course.listRecient();
    }

    //  List Selection
    this.lists = [
      {
        name: "top",
        obs: this._course.list$,
      }, {
        name: "recient",
        obs: this._course.recientList$,
      }, {
        name: "favorites",
        obs: this._course.favoriteList$,
      }, {
        name: "search",
        obs: this._course.search$,
      }
    ];

    //  Default Option
    this.selectedList = this.lists[0];


    //  Setup Form
    this._courseForm.Setup('search');
    this._courseForm.form$.subscribe((f) => {
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
      this._courseForm.resetSearch();
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



  trackCourse(index, item) {
    return item.id;
  }

}

export interface listCategories {
  name: string;
  obs: Observable<Object[]>;
}




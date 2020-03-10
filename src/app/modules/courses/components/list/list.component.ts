import { Component, OnInit, Input} from '@angular/core';
import { Observable } from 'rxjs';
import { flyIn } from 'src/app/animations';
import { CourseBackend } from '../../services/backend.service';
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

  @Input() options: Object = {
    list: ["search"],
    row: ["link"]
  }

  /*  All Available Options
      @Input() options: Object = {
        list: ["create", "edit", "delete", "search"],
        row: ["link", "favorite", "selector"]
      }
  */

  lists: Array<listCategories>;
  selectedList: listCategories;

  search: boolean = false;
  form: FormGroup;


  constructor(
    private _course: CourseBackend,
    private _courseForm: CourseFormService,
    private _account: AccountBackend,
    private feed: FeedbackService,
  ) { 
    console.log ("List.options:", this.options);

  }

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
      this.showSearch();
    } else {
      this.hideSearch();
    }
  }

  showSearch() {

    //  Update Flag
    this.search = true;

    //  Set Dropdown to Search
    this.selectedList = this.lists.find((l) => {
      return l.name == "search";
    });

    //  Clear Field
    this._courseForm.resetSearch();

    //  Turn Off Loader
    this.feed.loading = false;
  }

  hideSearch() {
    //  Update Flag
    this.search = false;

    //  Set list to Default
    this.selectedList = this.lists[0];

    //  Turn Off Loader
    this.feed.loading = false;
  }

  selectChange($event) {
    this.selectedList = this.lists.find((l) => {
      return l.name == $event.value.name;
    });

    if ($event.value.name == 'search') {
      this.showSearch();
    } else {
      this.hideSearch();
    }
  }



  trackBy(index, item) {
    return item.id;
  }

}

export interface listCategories {
  name: string;
  obs: Observable<Object[]>;
}




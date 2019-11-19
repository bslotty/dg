import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { flyIn } from 'src/app/animations';
import { Course, CourseBackend } from '../../services/backend.service';


@Component({
  selector: 'app-course-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [flyIn],
})
export class ListComponent implements OnInit {

  @Input() type: string = "top"; // recient | favorites | ...
  @Input() mode: string = "link";

  list$: Observable<Course[]>;

  constructor(
    private course_: CourseBackend,
  ) { }

  ngOnInit() {
    switch (this.type.toLowerCase()) {
      case 'top':
        this.course_.listTop();
        this.list$ = this.course_.list$;
        break;

      case 'recient':
        this.course_.listRecient();
        this.list$ = this.course_.recientList$;
        break;

      case 'favorites':
        this.course_.listFavorites();
        this.list$ = this.course_.favoriteList$;
        break;

      default:
        console.warn("Invalid Course List Type: ", this.type);
        break;
    }
  }

  trackCourse(index, item) {
    return item.id;
  }

}




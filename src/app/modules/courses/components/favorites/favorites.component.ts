import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { CourseBackend, Course } from '../../services/backend.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  courseList: Course[];

  constructor(
    private feed: FeedbackService,
    private courses: CourseBackend

  ) { }

  ngOnInit() {

    this.courses.list$.subscribe((courses) => {
      if (courses.length > 0) {
        console.log("list$.courses: ", courses);
        this.courseList = courses;
        this.feed.loading = false;
      }

    });

    if (this.courseList == undefined) {
      this.courses.genList("asc");
    }
  }

}

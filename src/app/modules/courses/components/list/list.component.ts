import { flyInPanelRow } from './../../../../animations';
import { CourseBackend } from './../../services/backend.service';
import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [flyInPanelRow],
})
export class ListComponent implements OnInit {

  courseList;

  constructor(
    public courses: CourseBackend,
    private feed: FeedbackService,
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




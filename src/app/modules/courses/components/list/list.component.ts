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
  resolve: boolean = false;

  constructor(
    public courses: CourseBackend,
    private feed: FeedbackService
  ) { }




  ngOnInit() {
    this.courses.list$.subscribe((courses) => {
      if (courses.length > 0) {
        console.log("list$.courses: ", courses);
        this.courseList = courses;
        this.resolve = true;
      }

    });

    if (this.courseList == undefined) {
      this.getCourseList("asc");
    }

  }




  getCourseList(sort) {
    this.resolve = false;

    /*
    this.courses.getList(sort).subscribe((v: Course[])=>{
      v.forEach((e, i)=>{
        setTimeout(() => {
          this.courseList.push(e);
        }, 30 * i)
      });

      this.loading = 0;
    });
    */

    //this.courses.getList(sort);
    this.courses.genList(sort);
  }



}




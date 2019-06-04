import { flyInPanelRow } from './../../../../animations';
import { CourseBackend } from './../../services/backend.service';
import { Component, OnInit } from '@angular/core';
import { Course } from '../../services/backend.service';
import { ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
    public courses: CourseBackend
  ) { }




  ngOnInit() {
    this.courses.list$.subscribe((courses) => {
      if (courses.length > 0) {
        console.log("list$.courses: ", courses);
        this.courseList = courses;
        this.resolve = true;
      }

    }, (e) => {
      console.warn("list$.error: ", e);
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

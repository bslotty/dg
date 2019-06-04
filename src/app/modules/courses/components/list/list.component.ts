import { flyInPanelRow } from './../../../../animations';
import { CourseBackend } from './../../services/backend.service';
import { Component, OnInit } from '@angular/core';
import { Course } from '../../services/backend.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [flyInPanelRow],
})
export class ListComponent implements OnInit {

  public loading: number = 1;
  public courseList: Course[] = [];


  constructor(
    public courses: CourseBackend
    
  ) { }




  ngOnInit() {
    this.getCourseList("asc");
  }




  getCourseList(sort) {

    this.loading = 1;

    this.courses.getList(sort).subscribe((v: Course[])=>{
      v.forEach((e, i)=>{
        setTimeout(() => {
          this.courseList.push(e);
        }, 30 * i)
      });

      this.loading = 0;
    });
  }

  

}

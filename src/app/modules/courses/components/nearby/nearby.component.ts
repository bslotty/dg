import { Component, OnInit } from '@angular/core';
import { CourseBackend, Course } from '../../services/backend.service';

@Component({
  selector: 'app-nearby',
  templateUrl: './nearby.component.html',
  styleUrls: ['./nearby.component.scss']
})
export class NearbyComponent implements OnInit {

  courseList: Course[] = [];

  constructor(
    private courseService: CourseBackend,
  ) { }

  ngOnInit() {
    this.courseService.list$.subscribe((res)=>{
      this.courseList = res;
    });
  }
}

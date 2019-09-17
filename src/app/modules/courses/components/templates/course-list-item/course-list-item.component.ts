import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../../services/backend.service';

@Component({
  selector: 'course-list-item',
  templateUrl: './course-list-item.component.html',
  styleUrls: ['./course-list-item.component.scss']
})
export class CourseListItemComponent implements OnInit {
  @Input() course: Course;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../../modules/courses/services/backend.service';

@Component({
  selector: 'course-list-item',
  templateUrl: './course-list-item.component.html',
  styleUrls: ['./course-list-item.component.scss']
})
export class CourseListItemComponent implements OnInit {
  @Input() course: Course;
  @Input() mode: string; // List(Fav&&Link), Selector(emit), 

  @Output() selected: EventEmitter<Course> = new EventEmitter();

  @Input() selectedCourse:Course;

  constructor() { }

  ngOnInit() {
  }

  favorite(course){
    console.log ("course", course);
  }

  selectCourse(course){
    this.selected.emit(course);
  }

}
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../../../services/backend.service';


@Component({
  selector: 'app-course-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [],
})
export class ListComponent implements OnInit {

  @Input() courseList: Course[];
  @Input() mode: string;

  @Output() selected: EventEmitter<Course> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  trackCourse(index, item) {
    return item.id;
  }

  selectCourse(course){
    this.selected.emit(course);
  }
}




import { Component, OnInit, Input } from '@angular/core';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Course } from '../../../services/backend.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [],
})
export class ListComponent implements OnInit {

  @Input() title: string;
  @Input() courseList: Course[];
  @Input() limit: boolean = true;
  @Input() from: number = 0;

  constructor(
    private feed: FeedbackService,
  ) { }

  ngOnInit() {}

  drop(e: CdkDragDrop<Course[]>) {
    console.log("drop Event: ", e);
    console.log ("courseList: ", this.courseList);
    moveItemInArray(this.courseList, e.previousIndex, e.currentIndex);
  }
  
}




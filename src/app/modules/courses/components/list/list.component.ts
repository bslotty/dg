import { Course } from './../../services/backend.service';
import { Component, OnInit, Input } from '@angular/core';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [],
})
export class ListComponent implements OnInit {

  @Input() title: string = "Courses";
  @Input() courseList: Course[];
  @Input() limit: boolean = true;
  @Input() from: number = 0;

  constructor(
    private feed: FeedbackService,
  ) { }

  ngOnInit() {}
  
}




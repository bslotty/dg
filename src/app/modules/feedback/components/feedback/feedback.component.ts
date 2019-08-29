import { FeedbackService } from './../../services/feedback.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  animations: [],
})
export class FeedbackComponent implements OnInit {

  constructor(
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
  }


}

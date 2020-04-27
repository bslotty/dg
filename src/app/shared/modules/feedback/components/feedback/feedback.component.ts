import { FeedbackService } from '../../services/feedback.service';
import { Component, OnInit, Input } from '@angular/core';
import { FeedbackErrorHandler } from 'src/app/shared/types';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  animations: [],
})
export class FeedbackComponent implements OnInit {

  @Input() handler: FeedbackErrorHandler;

  constructor(
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    console.log ("Feedback.Handler: ", this.handler);
  }


}

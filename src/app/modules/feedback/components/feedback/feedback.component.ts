import { FeedbackService } from './../../services/feedback.service';
import { Component, OnInit } from '@angular/core';
import { flyInPanelRow } from 'src/app/animations';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  animations: [flyInPanelRow],
})
export class FeedbackComponent implements OnInit {

  constructor(
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
  }


}

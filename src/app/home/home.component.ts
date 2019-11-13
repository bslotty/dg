import { Component, OnInit } from '@angular/core';
import { flyIn, fall } from 'src/app/animations';
import { FeedbackService } from '../modules/feedback/services/feedback.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [flyIn, fall],
})
export class HomeComponent implements OnInit {

  constructor(
    private feed: FeedbackService
  ) { }

  ngOnInit() {
  }

  toggleLoader() {
    this.feed.loading = !this.feed.loading;
  }

}

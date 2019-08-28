import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { flyInPanelRow } from 'src/app/animations';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [flyInPanelRow],
})
export class LoaderComponent implements OnInit {

  constructor(
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
  }

}

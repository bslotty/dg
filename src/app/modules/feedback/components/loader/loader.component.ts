import { Component, OnInit, Input } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { flyInPanelRow, fall } from 'src/app/animations';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [flyInPanelRow, fall],
})
export class LoaderComponent implements OnInit {

  @Input() small:boolean = false;

  diameter: number = 100;
  strokeWidth: number = 2;

  constructor(
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    if (this.small) {
      this.diameter = 36;
      this.strokeWidth = 5;
    }
  }

}

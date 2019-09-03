import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { fade, flyIn } from 'src/app/animations';
import { FeedbackService } from './modules/feedback/services/feedback.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fade, flyIn],
})

export class AppComponent {  
  constructor(
    private router: Router
  ){ }

  getRoute(outlet) {
    return this.router.url;
  }
}


export class ServerPayload {
  public status: string;
  public msg: string;
  public data: Array<any>;
}
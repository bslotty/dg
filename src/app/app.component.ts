import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { flyIn } from 'src/app/animations';
import { FeedbackService } from './modules/feedback/services/feedback.service';
import { AccountBackend } from './modules/account/services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [flyIn],
})

export class AppComponent {
  constructor(
    private router: Router,
    private account: AccountBackend,
  ) { }

  getRoute(outlet) {
    return this.router.url;
  }
}


export class ServerPayload {
  public status: string;
  public msg: string;
  public data: Array<any>;
}
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { ServerPayload } from 'src/app/app.component';
import { flyInPanelRow } from 'src/app/animations';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [flyInPanelRow]
})
export class DetailComponent implements OnInit {

  headerButtons = [{
    icon: 'icon-log-out',
    action: "logout",
    color: "transparent-primary"
  }];

  constructor(
    private account: AccountBackend,
    private feed: FeedbackService,
  ) { }

  ngOnInit() {
  }

  

  actionClick($event) {
    if ($event == "logout") {
      this.logout();
    }
  }

  logout() {

    var payload = new ServerPayload;
    payload.status  = "success";
    payload.msg     = "You are now logged out";

    this.feed.finializeLoading(payload, true);
    this.account.logout();
  }
}

import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { ServerPayload } from 'src/app/app.component';
import { AccountBackend } from '../../services/backend.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

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
    payload.status = "success";
    payload.msg = "You are now logged out";

    this.account.logout();
  }
}

import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerPayload } from 'src/app/app.component';
import { flyInPanelRow } from 'src/app/animations';


@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css'],
  animations: [flyInPanelRow]
})
export class SetPasswordComponent implements OnInit {

  public verified: boolean = false;

  constructor(
    public account: AccountBackend,
    public location: Location,
    public feed: FeedbackService,
    public route: ActivatedRoute,
    public router: Router,

  ) { }

  ngOnInit() {
    this.verifyToken();
  }

  verifyToken() {
    this.feed.initiateLoading();
    let token = this.route.snapshot.paramMap.get('token');
    this.account.verifyToken(token).subscribe((res: ServerPayload)=>{
      if (res.status == "success") {
        this.verified = true;
      } else if (res.status == "error" /*&& res.msg.indexOf("expired") > -1*/) {
        this.router.navigate(["account/forgot"]);
      } 

      this.feed.finializeLoading(res, true);
    });
  }
}

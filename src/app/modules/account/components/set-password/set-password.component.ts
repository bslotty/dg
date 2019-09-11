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

  private verified: boolean = false;

  constructor(
    private account: AccountBackend,
    private feed: FeedbackService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {
    this.feed.loading = true;
    this.verifyToken();
  }

  verifyToken() {
    let token = this.route.snapshot.paramMap.get('token');
    this.account.verifyToken(token).subscribe((res: ServerPayload)=>{
      if (this.account.rCheck(res)) {
        this.verified = true;
        this.feed.loading = false;

      } else {
        this.router.navigate(["account/forgot"]);
      } 
      
    });
  }
}

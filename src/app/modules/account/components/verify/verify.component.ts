import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { ServerPayload } from 'src/app/app.component';
import { loading } from 'src/app/animations';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  animations: [loading]
})
export class VerifyComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public feed: FeedbackService,
    public account: AccountBackend,
  ) { }

  ngOnInit() {
    this.verifyToken();
  }

  verifyToken() {
    this.feed.initiateLoading();
    let token = this.route.snapshot.paramMap.get('token');
    this.account.verify(token).subscribe((res: ServerPayload)=>{
      if (res.status == "success") {
        this.router.navigate(["/leagues"]);
      }

      this.feed.finializeLoading(res, true);
    });
  }

}

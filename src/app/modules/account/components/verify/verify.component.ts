import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { ServerPayload } from 'src/app/app.component';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  animations: []
})
export class VerifyComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public account: AccountBackend,
  ) { }

  ngOnInit() {
    this.verifyToken();
  }

  verifyToken() {
    let token = this.route.snapshot.paramMap.get('token');

    this.account.verify(token).subscribe((res: ServerPayload)=>{
      if (this.account.rCheck(res)) {
        this.router.navigate(["/sessions"]);
      }
    });
  }

}

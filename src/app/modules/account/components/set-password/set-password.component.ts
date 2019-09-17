import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { ServerPayload } from 'src/app/app.component';
import { FormGroup } from '@angular/forms';
import { AccountFormService } from '../../services/account-form.service';
import { AccountBackend } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css'],
  animations: []
})
export class SetPasswordComponent implements OnInit {

  private form: FormGroup = new FormGroup({});

  constructor(
    private feed: FeedbackService,
    private accountForm: AccountFormService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    let token = this.route.snapshot.paramMap.get('token');
    this.accountForm.VerifyForgotToken(token);
    this.accountForm.accountForm$.subscribe((t)=>{
      this.form = t;
      this.feed.loading = false;
    });
  }

  onFormSubmit() {
    this.accountForm.SubmitSet();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { AccountFormService } from '../../services/account-form.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
  animations: []
})
export class ForgotComponent implements OnInit {

  form: FormGroup;

  constructor(
    private feed: FeedbackService,
    private accountForm: AccountFormService,
  ) { }

  ngOnInit() {
    this.accountForm.Setup("forgot");
    this.accountForm.form$.subscribe((t) => {
      this.form = t;

      this.feed.stopLoading("forgot");
    });
  }

  onFormSubmit() {
    this.accountForm.SubmitForgot();
  }
}

import { flyInPanelRow } from './../../../../animations';
import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { AccountFormService } from '../../services/account-form.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [flyInPanelRow]
})
export class CreateComponent implements OnInit {
  form: FormGroup;

  constructor(
    private accountForm: AccountFormService,
    private feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.accountForm.Setup("register");
    this.accountForm.form$.subscribe((f) => {
      console.log("accountForm.registerForm", f);

      this.form = f;
      this.feed.stopLoading("register");
    });

  }

  onFormSubmit() {
    this.accountForm.SubmitRegistration();
  }
}

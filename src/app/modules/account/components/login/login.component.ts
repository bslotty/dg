import { FeedbackService } from './../../../feedback/services/feedback.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { AccountFormService } from '../../services/account-form.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [],
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    public accountForm: AccountFormService,
    public feed: FeedbackService,
  ) { }

  ngOnInit() { 
    /*
    if (this.account.user) {
      this.router.navigate(["leagues"]);
    }
    */

    this.accountForm.CreateForm("login");
    this.accountForm.accountForm$.subscribe((f)=>{
      this.form = f;
      this.feed.loading = false;
    });
  }

  onFormSubmit() {
    this.accountForm.SubmitLogin();
  }

}

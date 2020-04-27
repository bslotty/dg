import { FeedbackService } from '../../../../shared/modules/feedback/services/feedback.service';
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
    this.accountForm.Setup("login");
    this.accountForm.form$.subscribe((f)=>{
      this.form = f;
      this.feed.stopLoading("login");
    });
  }

  onFormSubmit() {
    
    this.accountForm.SubmitLogin();
  }

}

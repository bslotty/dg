import { FeedbackService } from './../../../feedback/services/feedback.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { flyInPanelRow } from 'src/app/animations';
import { AccountFormService } from '../../services/account-form.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [flyInPanelRow],
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

    /*
    if (this.form.valid && this.form.dirty){
      this.form.disable();

      //  Set Data
      var user = new Player(
        null, null, null, 
        this.form.get('email').value, 
        this.form.get('password').value
      );

      //  Send Data
      this.account.login(user).subscribe((res) => {
        this.form.enable();

        //  Redirect if available; else Goto leagues
        if (this.account.rCheck(res)){
          if (this.account.redirectUrl) {
            this.router.navigate([this.account.redirectUrl]);
          } else {
            this.router.navigate(['/sessions']);
          }
        } else {

          //  Polish form for re-submit
          this.form.markAsPristine();
        }
   
      });
    }
    */
  }

}

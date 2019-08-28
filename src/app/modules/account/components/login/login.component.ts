import { FeedbackService } from './../../../feedback/services/feedback.service';
import { Component, OnInit } from '@angular/core';
import { User, AccountBackend, Password } from '../../services/backend.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { flyInPanelRow } from 'src/app/animations';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [flyInPanelRow],
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  submitText: string = 'LOGIN';

  resolve: boolean = true;

  passwordFieldType: string = "password" // password | text

  constructor(
    public account: AccountBackend,
    public router: Router,
    public builder: FormBuilder,
    public feed: FeedbackService,
  ) { }

  ngOnInit() { 
    if (this.account.user) {
      this.router.navigate(["leagues"]);
    }

    this.initForm();
    this.resolve = true;
  }

  initForm() {
    this.form = this.builder.group({
      email: ["Brandon@brandonSlotty.com", [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(128), 
        Validators.pattern("(.)+@(.)+")
      ]],
      password: ["BAS6702m", [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(128)
      ]],
    })
  }

  onFormSubmit() {
    if (this.form.valid && this.form.dirty){

      this.resolve = false;
      this.form.disable();
      this.submitText = "...";

      //  Set Data
      var user = new User(
        null, null, null, 
        this.form.get('email').value, 
        new Password (this.form.get('password').value)
      );

      //  Send Data
      this.account.login(user).subscribe((payload) => {

        //  this.feed.finializeLoading(payload, true);
        this.resolve = true;
        this.form.enable();
        this.submitText = "LOGIN";

        //  Redirect if available; else Goto leagues
        if (this.account.redirectUrl) {
          this.router.navigate([this.account.redirectUrl]);
        } else {
          this.router.navigate(['/leagues']);
        }
      });
    }
  }

  showPassword(bool) {
    if (bool) {
      this.passwordFieldType = "text";
    } else {
      this.passwordFieldType = "password";
    }
  }
 
}

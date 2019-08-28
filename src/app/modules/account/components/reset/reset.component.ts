import { AccountBackend, Password } from 'src/app/modules/account/services/backend.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-account-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  animations: [],
})
export class ResetComponent implements OnInit {

  public form: FormGroup;

  //  password | text
  passwordType: string  = 'password';
  confirmType: string   = 'password';
  oldType: string       = 'password';

  constructor(
    public builder: FormBuilder,
    public account: AccountBackend,
    public router: Router,
    public feed: FeedbackService,
  ) { }


  ngOnInit() {
    this.initForm();

    //  Password Match
    this.form.get('conf').valueChanges.pipe(this.account.passwordPipe).subscribe((v) => {

      //  Match
      if (this.form.get('pass').value != this.form.get('conf').value) {
        this.form.get("conf").setErrors({ match: true });
      } else {
        this.form.get("conf").setErrors(null);
      }
      
    });
  }


  initForm() {
    this.form = this.builder.group({
      old: ["", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128)
      ]],
      pass: ["", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128)
      ]],
      conf: ["", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128)
      ]],
    });

    //  Add Old if token doesnt exist; reset/change
  }


  onFormSubmit() {
    if (this.form.valid && this.form.dirty) {

      this.account.user.pass = new Password(
        this.form.get('pass').value,
        this.form.get('conf').value,
      );

      this.account.updatePassword(this.account.user).subscribe((res) => {
        //  Clear Password
        this.account.user.pass = null;
      });
    }
  }

  showPassword($field, $bool) {
    if ($field == 'pass') { 
      this.passwordType = $bool ? 'text' : 'password';
      
    } else if ($field == "conf") {
      this.confirmType = $bool ? 'text' : 'password';

    } else if($field == "old") {
      this.oldType = $bool ? 'text' : 'password';

    }
  }

}

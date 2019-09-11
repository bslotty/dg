import { AccountBackend, Password } from 'src/app/modules/account/services/backend.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-account-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  animations: [],
})
export class ResetComponent implements OnInit {

  form: FormGroup;

  @Input() fromToken: boolean = false;

  //  password | text
  passwordType: string  = 'password';
  confirmType: string   = 'password';
  oldType: string       = 'password';

  constructor(
    private builder: FormBuilder,
    private account: AccountBackend,
    private router: Router,
    private feed: FeedbackService,
  ) { }


  ngOnInit() {
    this.initForm();

    this.form.valueChanges.pipe(this.account.passwordPipe).subscribe((t)=>{
      console.log ("form.ValueChanges: ", t);

      if (t["old"] == t["pass"]) {
        this.form.get("pass").setErrors({ same: true });
      } else if (t["old"] == t["conf"]) {
        this.form.get("conf").setErrors({ same: true });
      } else if (t["pass"] != t["conf"] && this.form.get("conf").dirty){
        this.form.get("conf").setErrors({ match: true });
      } else {
        this.form.setErrors(null);
      }
    });

    this.feed.loading  = false;
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

      var newPass       = new Password();
      newPass.current   = this.form.get('pass').value,
      newPass.confirm   = this.form.get('conf').value;
      newPass.old       = this.form.get('old').value;

      this.account.user.password = newPass;
      this.account.updatePassword(this.account.user).subscribe((res) => {
        this.account.user.password = null;
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

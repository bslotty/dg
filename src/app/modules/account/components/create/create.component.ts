import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { flyInPanelRow } from './../../../../animations';
import { User, Password } from './../../services/backend.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [flyInPanelRow]
})
export class CreateComponent implements OnInit {
  public form: FormGroup;

  //  password | text
  passwordType: string  = "password";
  confirmType: string   = "password";

  constructor(
    public builder: FormBuilder,
    public account: AccountBackend,
    public feed: FeedbackService,    
    public router: Router,
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

    this.feed.finializeLoading();
  }

  initForm(){
    this.form = this.builder.group({
      first:  ["", [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(128)
      ]],
      last:   ["", [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(128)
      ]],
      email:  ["", [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(128), 
        Validators.pattern("(.)+@(.)+")
      ]],
      pass:   ["", [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(128)
      ]],
      conf:   ["", [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(128)
      ]],
    });
  }

  onFormSubmit() {
    
    //  If form is valid and password matches
    if (this.form.valid && this.form.dirty) {

      //  store user
      var user    = new User(0);
      user.first  = this.form.get('first').value,
      user.last   = this.form.get('last').value,
      user.email  = this.form.get('email').value,
      user.pass   = new Password(this.form.get('pass').value);

      //  send creation request
      this.account.register(user).subscribe((res)=>{
        
        if (res.status == "success" ){
          this.router.navigate(["account/login"]);
        }
      });

    }
  }

  showPassword($field, $bool) {
    if ($field == 'pass') { 
      this.passwordType = $bool ? 'text' : 'password';
      
    } else if ($field == "conf") {
      this.confirmType = $bool ? 'text' : 'password';

    }
  }

}

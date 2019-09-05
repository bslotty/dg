import { AccountBackend, Player } from 'src/app/modules/account/services/backend.service';
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
  form: FormGroup;

  //  password | text
  passwordType: string  = "password";
  confirmType: string   = "password";

  constructor(
    private builder: FormBuilder,
    private account: AccountBackend,
    private feed: FeedbackService,    
    private router: Router,
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

      console.log ("form: ", this.form);
    });



    this.feed.loading = false;
  }

  initForm(){
    this.form = this.builder.group({
      first:  ["Brandon", [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(128)
      ]],
      last:   ["Slotty", [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(128)
      ]],
      email:  ["Brandon@BrandonSlotty.com", [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(128), 
        Validators.pattern("(.)+@(.)+")
      ]],
      pass:   ["BAS6702m2", [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(128)
      ]],
      conf:   ["BAS6702m", [
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
      var user          = new Player(0);
      user.first_name   = this.form.get('first').value;
      user.last_name    = this.form.get('last').value;
      user.email        = this.form.get('email').value;
      user.password     = this.form.get('pass').value;

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

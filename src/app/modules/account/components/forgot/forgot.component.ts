import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountBackend, User } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
  animations: []
})
export class ForgotComponent implements OnInit {

  form: FormGroup;
  resolve: boolean = false;

  constructor(
    public feed: FeedbackService,
    public builder: FormBuilder,
    public account: AccountBackend,
    public location: Location,
  ) { }

  ngOnInit() {
    this.initForm();
    this.resolve = true;
  }

  initForm(){
    this.form = this.builder.group({
      email:  ["", [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(128), 
        Validators.pattern("(.)+@(.)+")
      ]]
    });
  }

  onFormSubmit (){
    if (this.form.valid && this.form.dirty) {  
      this.resolve = false;

      var user    = new User(null);
      user.email  = this.form.get('email').value;
      
      this.account.forgotPassword(user).subscribe((res)=>{
        this.resolve = true;
      });
    }
  }

  back() {
    this.location.back();
  }
}

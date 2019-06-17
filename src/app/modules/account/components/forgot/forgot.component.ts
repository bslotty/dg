import { loading, flyInPanelRow } from 'src/app/animations';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AccountBackend, User } from '../../services/backend.service';
import { Validators } from '@angular/forms';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { ServerPayload } from 'src/app/app.component';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
  animations: [flyInPanelRow]
})
export class ForgotComponent implements OnInit {

  public form: FormGroup;

  constructor(
    public feed: FeedbackService,
    public builder: FormBuilder,
    public account: AccountBackend,
    public location: Location,
  ) { }

  ngOnInit() {
    this.initForm();
    this.feed.finializeLoading();
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
      this.feed.initiateLoading();

      var user    = new User(null);
      user.email  = this.form.get('email').value;
      
      this.account.forgotPassword(user).subscribe((res: ServerPayload)=>{
        this.feed.finializeLoading(res, true);
      });
    }
  }

  back() {
    this.location.back();
  }
}

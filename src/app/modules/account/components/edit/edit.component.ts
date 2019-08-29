import { ServerPayload } from 'src/app/app.component';
import { FeedbackService } from './../../../feedback/services/feedback.service';
import { flyInPanelRow } from './../../../../animations';
import { AccountBackend, User } from 'src/app/modules/account/services/backend.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-account-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  animations: [flyInPanelRow]
})
export class EditComponent implements OnInit {

  public form: FormGroup;

  constructor(
    public builder: FormBuilder,
    public account: AccountBackend,
    public location: Location,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.initForm();

    this.feed.loading = false;
  }

  initForm(){
    this.form = this.builder.group({
      first:  [this.account.user.first, [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(128)
      ]],
      last:   [this.account.user.last, [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(128)
      ]],
      email:  [this.account.user.email, [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(128), 
        Validators.pattern("(.)+@(.)+")
      ]],
    });
  }

  onFormSubmit (){
    if (this.form.valid && this.form.dirty) {  

      var user    = new User(this.account.user.id);
      user.first  = this.form.get('first').value;
      user.last   = this.form.get('last').value;
      user.email  = this.form.get('email').value;
      
      this.account.updateUser(user).subscribe((payload: ServerPayload)=>{
        
        if (payload['status'] == "success") {
          this.account.user.first   = user.first;
          this.account.user.last    = user.last;
          this.account.user.email   = user.email;
        }
      });
    }
  }

  back() {
    this.location.back();
  }
}

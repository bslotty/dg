import { ServerPayload } from 'src/app/app.component';
import { FeedbackService } from './../../../feedback/services/feedback.service';
import { flyInPanelRow } from './../../../../animations';
import { AccountBackend, User, Player } from 'src/app/modules/account/services/backend.service';
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
      first:  [this.account.user.first_name, [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(128)
      ]],
      last:   [this.account.user.last_name, [
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

      var p    = new Player(this.account.user.id);
      p.first_name  = this.form.get('first').value;
      p.last_name   = this.form.get('last').value;
      p.email       = this.form.get('email').value;
      
      this.account.updateUser(p).subscribe((payload: ServerPayload)=>{
        
        if (this.account.rCheck(payload)) {
          this.account.user.first_name  = p.first_name;
          this.account.user.last_name   = p.last_name;
          this.account.user.email       = p.email;
        }
      });
    }
  }

  back() {
    this.location.back();
  }
}

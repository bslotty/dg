import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountBackend, User, Player } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
  animations: []
})
export class ForgotComponent implements OnInit {

  form: FormGroup;

  constructor(
    private feed: FeedbackService,
    private builder: FormBuilder,
    private account: AccountBackend,
    private location: Location,
  ) { }

  ngOnInit() {
    this.initForm();
    this.feed.loading = false;
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

      var user    = new Player(null);
      user.email  = this.form.get('email').value;
      
      this.account.forgotPassword(user).subscribe((res)=>{
        //  Confirmation Page?
        //  Home Page?
      });
    }
  }

  back() {
    this.location.back();
  }
}

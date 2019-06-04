import { Location } from "@angular/common";
import { AccountBackend, Password } from 'src/app/modules/account/services/backend.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { filter, debounceTime } from 'rxjs/operators';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { ServerPayload } from 'src/app/app.component';
import { Router } from '@angular/router';
import { flyInPanelRow } from "src/app/animations";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  animations: [flyInPanelRow],
})
export class ResetComponent implements OnInit {

  public form: FormGroup;
  public passMatch: boolean;

  constructor(
    public builder: FormBuilder,
    public account: AccountBackend,
    public location: Location,
    public feed: FeedbackService,
    public router: Router,
    
  ) { }

  ngOnInit() {
    this.initForm();

    //  Listen to password confirmation updates
    this.form.get('conf').valueChanges.pipe(this.account.passwordPipe).subscribe((v)=>{
      if (this.form.get('pass').value == this.form.get('conf').value) {
        this.passMatch = true;
      } else {
        this.passMatch = false;
      }
    });
  }


  initForm(){
    this.form = this.builder.group({
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

  back() {
    this.location.back();
  }

  onFormSubmit() {
    if (this.form.valid && this.form.dirty && this.passMatch) {  
      this.feed.initiateLoading();

      this.account.user.pass = new Password(
        this.form.get('pass').value, 
        this.form.get('conf').value,
      );

      this.account.updatePassword(this.account.user).subscribe((payload: ServerPayload)=>{
        this.feed.finializeLoading(payload, true);

        if (payload.status == "success") {
          this.router.navigate(["account"]);
        }
      });
    }
  }
}

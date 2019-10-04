import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { AccountFormService } from '../../services/account-form.service';

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
    private feed: FeedbackService,
    private accountForm: AccountFormService,
  ) { }


  ngOnInit() {
    this.accountForm.Setup("reset");
    this.accountForm.form$.subscribe((t)=>{
      this.form = t;
      this.feed.loading  = false;
    });

  }

  onFormSubmit() {
    this.accountForm.SubmitReset();
  } 
}

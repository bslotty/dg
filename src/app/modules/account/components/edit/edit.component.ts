
import { FeedbackService } from './../../../feedback/services/feedback.service';
import { flyInPanelRow } from './../../../../animations';
import { FormGroup} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AccountFormService } from '../../services/account-form.service';

@Component({
  selector: 'app-account-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  animations: [flyInPanelRow]
})
export class EditComponent implements OnInit {

  public form: FormGroup;

  constructor(
    public accountForm: AccountFormService,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.accountForm.Setup("update");
    this.accountForm.form$.subscribe((f)=>{
      this.form = f;
      this.feed.loading = false;
    });

  }

  onFormSubmit(){
    this.accountForm.SubmitUpdate();
  }
}

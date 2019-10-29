import { Component, OnInit } from '@angular/core';
import { AccountFormService } from 'src/app/modules/account/services/account-form.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-players',
  templateUrl: './select-players.component.html',
  styleUrls: ['./select-players.component.scss']
})
export class SelectPlayersComponent implements OnInit {

  form: FormGroup;

  constructor(
    private accountForm: AccountFormService,
  ) { }

  ngOnInit() {
    this.accountForm.Setup("search");
    this.accountForm.form$.subscribe((f)=>{
      this.form = f;
    });

  }

}

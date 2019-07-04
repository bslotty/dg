import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/modules/account/services/backend.service';
import { StatsBackend } from '../../services/backend.service';
import { Permission } from 'src/app/modules/permissions/services/backend.service';

@Component({
  selector: 'app-create-temp-users',
  templateUrl: './create-temp-users.component.html',
  styleUrls: ['./create-temp-users.component.css']
})
export class CreateTempUsersComponent implements OnInit {

  form: FormGroup;
  headerButtons = [{
    icon: "icon-x",
    action: "close",
    color: "transparent-primary"
  }];

  constructor(
    public dialog: MatDialogRef<CreateTempUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public builder: FormBuilder,
    public stats: StatsBackend,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  actionClick($event){
    if ($event == "close") {
      this.close();
    }
  }

  initForm() {
    this.form = this.builder.group({
      name: ["", Validators.required]
    });
  }


  close(res = false){
    this.dialog.close(res);
  }

  onFormSubmit(){
    this.dialog.close(this.data.user);
  }

  
  addTemporaryPlayer() {
    if (this.form.valid && this.form.dirty) {
      var tempPlayer = new User(null, this.form.get('name').value, "");

      this.stats.createTempPlayer(this.data.league, this.data.session, tempPlayer).subscribe((res)=>{
        console.log ("res:", res);
        tempPlayer.id = res["insertID"];
        
        console.log ("TempPlayerCreated!", tempPlayer);
        this.dialog.close(new Permission(null, this.data.league, tempPlayer) );
      });
    }
  }
  
}

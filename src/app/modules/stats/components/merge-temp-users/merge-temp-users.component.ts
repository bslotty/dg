import { Permission } from 'src/app/modules/permissions/services/backend.service';
import { PermissionBackend } from './../../../permissions/services/backend.service';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StatsBackend } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-merge-temp-users',
  templateUrl: './merge-temp-users.component.html',
  styleUrls: ['./merge-temp-users.component.css']
})
export class MergeTempUsersComponent implements OnInit {

  public tempUsers = [];
  public excludedUsers = [];

  public selTemp;
  public selExisting;



  membersList = this.data.members;
  playerList = this.data.players;
  tempUsersList = this.data.tempUsers;

  availablePlayers = [];

  form: FormGroup;

  constructor(
    public dialog: MatDialogRef<MergeTempUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public permissions: PermissionBackend,
    public stats: StatsBackend,
    public builder: FormBuilder,
    public feed: FeedbackService,
  ) {  }

  ngOnInit() {
    console.log ("members: ", this.membersList); 
    console.log ("temp: ", this.tempUsersList); 
    console.log ("players: ", this.playerList);

    this.initForm();
    this.getAvailablePlayers();

  }


  getAvailablePlayers() {
    //  Push All to Available
    //  Remove Already Added
    this.membersList.forEach((member) => {
      var available = true;

      this.playerList.forEach((player) => {
        if (member.user.id == player.user.id) {
          available = false;
        }
      });

      this.tempUsersList.forEach((temp)=>{
        if(member.user.id == temp.user.id) {
          available = false;
        }
      })

      if (available) {
        this.availablePlayers.push(member);
      }

    });
  }

  initForm() {
    this.form = this.builder.group({
      temp: ["", Validators.required],
      existing: ["", Validators.required]
    });
  }

  close(){
      this.dialog.close();
  }

  mergePlayers(){
    if (this.form.valid && this.form.dirty) {
      var player = this.form.get("existing").value["user"];
      var temp = this.form.get("temp").value["user"];

      this.stats.merge(this.data.league, this.data.session, player, temp).subscribe((res)=>{
        this.feed.finializeLoading(res, true);
        this.dialog.close();
      });
    }
  }


}

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { League } from 'src/app/modules/leagues/services/backend.service';
import { Permission, PermissionBackend } from 'src/app/modules/permissions/services/backend.service';
import { Team, StatsBackend, Stats } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CreateComponent } from 'src/app/modules/account/components/create/create.component';
import { CreateTempUsersComponent } from '../create-temp-users/create-temp-users.component';
import { User } from 'src/app/modules/account/services/backend.service';
import { Session } from 'src/app/modules/sessions/services/backend.service';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.css']
})
export class CreatePlayerComponent implements OnInit {
  form: FormGroup;

  league: League = this.data.league;
  session: Session = this.data.session;

  availablePlayers: Permission[] = [];
  teamList: Team[] = this.data.teamList;

  resolve: boolean = false;
  headerButtons = [{
    icon: "icon-x",
    action: "close",
    color: "transparent-primary",
  }];

  constructor(
    public permissions: PermissionBackend,
    public stats: StatsBackend,
    public feed: FeedbackService,
    public dialog: MatDialog,
    public builder: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateComponent>,
  ) { }

  ngOnInit() {
    this.initForm();

    /*
    console.log("league: ", this.data.league);
    console.log("session: ", this.data.session);
    console.log("members: ", this.data.memberList);
    console.log("players: ", this.data.playerList);
    */

    this.getAvailablePlayers();
  }

  populateData() {

  }

  actionClick($event) {
    if ($event == "close"){ 
      this.close();
    }
  }



  close() {
    this.dialogRef.close();
  }

  initForm() {
    if (this.session.format != 'ffa') {
      this.form = this.builder.group({
        player: ["", Validators.required],
        team: ["", Validators.required],
      });
    } else {
      this.form = this.builder.group({
        player: ["", Validators.required],
        team: ["null"],
      });
    }
  }

  disableFormCheck() {
    var disable = this.availablePlayers.length == 0 ? true : false;
    
    if (disable) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  getAvailablePlayers() {
    //  Push All to Available
    //  Remove Already Added
    this.data.memberList.forEach((member) => {
      var available = true;

      this.data.playerList.forEach((player) => {
        if (member.user.id == player.user.id) {
          available = false;
        }
      });

      if (available) {
        this.availablePlayers.push(member);
      }

      console.log("available: ", this.availablePlayers);
      this.disableFormCheck();

    });
  }


  saveRoster() {
    if (this.form.valid && this.form.dirty) {

      this.stats.createPlayer(
        this.data.league, 
        this.data.session, 
        this.form.get('player').value['user'], 
        this.form.get('team').value
      ).subscribe((data) => {
        this.feed.finializeLoading(data, true);
        this.close();
      });
    }
  }


  createTemporaryPlayer() {
    var tempPlayerDiag = this.dialog.open(CreateTempUsersComponent, {
      width: "500px",
      data: {
        league: this.league,
        session: this.session,
      }
    });

    tempPlayerDiag.afterClosed().subscribe((res) => {
      //  Set New Player into Form
      this.availablePlayers.push(res);

      this.disableFormCheck();

      this.form.get('player').setValue(res);
      this.form.get('player').markAsDirty();
    });
  }
}


export class Signup {
  constructor(
    public user: User,
    public active: boolean = false,
  ) { }
}
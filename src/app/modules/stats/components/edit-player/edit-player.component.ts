import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { League, LeagueBackend } from 'src/app/modules/leagues/services/backend.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Session } from 'src/app/modules/sessions/services/backend.service';
import { StatsBackend, Team } from '../../services/backend.service';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Permission, PermissionBackend } from 'src/app/modules/permissions/services/backend.service';
import { CreateComponent } from 'src/app/modules/account/components/create/create.component';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.css']
})
export class EditPlayerComponent implements OnInit {
  form: FormGroup;

  league: League = this.data.league;
  session: Session = this.data.session;

  availablePlayers: Permission[] = [];
  teamList: Team[] = this.data.teamList;


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

    console.log("league: ", this.data.league);
    console.log("session: ", this.data.session);
    console.log("members: ", this.data.memberList);
    console.log("players: ", this.data.playerList);


    this.getAvailablePlayers();
  }

  populateData() {

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

      console.log ("this.form", this.form);
      console.log ("player: ", this.form.get('player').value['user']);
      console.log ("team: ", this.form.get('team').value);

      this.stats.createPlayer(
        this.data.league, 
        this.data.session, 
        this.form.get('player').value['user'], 
        this.form.get('team').value).subscribe((data) => {
        console.log("createTeam.Complete!", data);
        this.feed.finializeLoading(data, true);

        this.close();
      });
    }
  }


}

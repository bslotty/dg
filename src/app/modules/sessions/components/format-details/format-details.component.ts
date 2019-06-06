import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ServerPayload } from 'src/app/app.component';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { PermissionBackend } from 'src/app/modules/permissions/services/backend.service';
import { SessionBackend } from 'src/app/modules/sessions/services/backend.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { StatsBackend } from 'src/app/modules/stats/services/backend.service';

@Component({
  selector: 'app-format-details',
  templateUrl: './format-details.component.html',
  styleUrls: ['./format-details.component.css']
})
export class FormatDetailsComponent implements OnInit {

  public types = [
    {
      name: 'Free For All',
      enum: 'ffa',
      desc: `Every person for themselves! This is standard play.`,
    },{
      name: 'Teams: Sum',
      enum: 'team-sum',
      desc: `This format will combine the scores of each player on each team. Rankings will be sorted by the Team's Total Score.`,
    },{
      name: 'Teams: Average',
      enum: 'team-average',
      desc: `This format will average the throw totals of each player against par. Rankings will be sorted by the Team's Average Score.`,
    },{
      name: 'Teams: Best Only',
      enum: 'team-best',
      desc: `This format will only count the best score of each hole. Scores are set from the best scores of each hole.`,
    }
  ];

  selected;
  hasAccess:boolean = false;
  resetDisclaimer: boolean = false;
  resolve: boolean = false;
  headerButtons = [{
    icon: "icon-x",
    color: "transparent-primary",
    action: "close",
  }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<FormatDetailsComponent>,
    public permission: PermissionBackend,
    public sessions: SessionBackend,
    public account: AccountBackend,
    public stats: StatsBackend,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.selected = this.data.session.format;

    this.permission.memberList(this.data.league).subscribe((members)=>{
      //  Admin Check
      members.filter((member)=>{
        if (this.account.user.id == member.user.id) {
          if (
            member.level == "creator" ||
            member.level == "moderator"
          ) {
            this.hasAccess = true;
          }
        }
      });
    });


  }

  actionClick($event) {
    if ($event == "close"){ 
      this.close();
    }
  }


  disclaimerCheck(type) {
    if (type.indexOf("team") > -1 && this.selected == "ffa") {
      //  User is changing from FFA to Team; Show Disclaimer 
    }
  }

  setFormat(type) {
    console.log ("current: ", this.selected);
    console.log ("type: ", type);

    this.data.session.format = type.enum;

    this.sessions.setSessionFormat(this.data.league, this.data.session).subscribe((res: ServerPayload)=>{
      if (res['status'] == 'success') {
        
        this.selected = type.enum;
        
        this.feed.finializeLoading(res, true);
        this.dialog.close();
        this.stats.update$.next(true);
      }
    });

  }

  close(){
    this.dialog.close();
  }
}



/*
  Nathan 

  Random Lake WI

    Power Code,






*/
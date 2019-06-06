import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { StatsBackend, Stats } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-delete-team',
  templateUrl: './delete-team.component.html',
  styleUrls: ['./delete-team.component.css']
})
export class DeleteTeamComponent implements OnInit {

  deleteConfirm: boolean = false;
  resolve: boolean = false;
  playerListEmpty: boolean = true;

  headerButtons = [{
    icon: "icon-x",
    action: "close",
    color: "transparent-primary",
  }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<DeleteTeamComponent>,
    public stats: StatsBackend,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.populateData();
  }

  actionClick($event) {
    if ($event == "close"){ 
      this.close();
    }
  }

  populateData() {
    combineLatest(
      this.stats.getList(this.data.session),
      this.stats.getTeams(this.data.session)
    ).subscribe(([stats, teams])=>{
      if (stats.length > 0) {
        this.playerListEmpty = false;
      }
    });

  }

  toggleDelete() {
    this.deleteConfirm = !this.deleteConfirm;
  }


  delete() {
    console.warn("Delete");
    if (this.deleteConfirm) {
      this.stats.deleteTeam(this.data.league, this.data.session, this.data.team).subscribe((res)=>{
        this.feed.finializeLoading(res, true);
        this.close();
      });
    }
  }

  close() {
    this.dialog.close();
  }

}

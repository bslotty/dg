import { Component, OnInit, Inject } from '@angular/core';
import { StatsBackend } from '../../services/backend.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-delete-player',
  templateUrl: './delete-player.component.html',
  styleUrls: ['./delete-player.component.css']
})
export class DeletePlayerComponent implements OnInit {

  deleteConfirm: boolean = false;

  headerButtons = [{
    icon: "icon-x",
    action: "close",
    color: "transparent-primary",
  }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<DeletePlayerComponent>,
    public stats: StatsBackend,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {  }

  actionClick($event) {
    if ($event == "close"){ 
      this.close();
    }
  }

  close() {
    this.dialog.close();
  }

  confirmDelete() {
    this.deleteConfirm = !this.deleteConfirm;
  }

  removePlayer() {
    this.stats.removePlayer(this.data.league, this.data.session, this.data.user).subscribe((res)=>{
      this.feed.finializeLoading(res, true);
      this.dialog.close();
    });
  }

}

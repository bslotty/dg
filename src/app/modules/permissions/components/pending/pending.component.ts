import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PermissionBackend, Permission } from '../../services/backend.service';
import { ServerPayload } from 'src/app/app.component';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {

  recruitList: Permission[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<PendingComponent>,
    public permissions: PermissionBackend,
    public feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.recruitList = this.data.recruits;
  }

  close() {
    this.dialog.close();
  }

  update (permission, action = "pending") {
    permission.status = action;
    permission.level = "member";

    this.permissions.update(this.data.league, permission).subscribe((res: ServerPayload) => {
      this.feed.finializeLoading(res, true);
      this.close();
    });
  }

}

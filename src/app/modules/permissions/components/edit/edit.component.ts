import { PermissionBackend } from './../../services/backend.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ServerPayload } from 'src/app/app.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  animations: []
})
export class EditComponent implements OnInit {

  recruit = this.data.permission;
  league = this.data.league;

  headerButtons = [{
    action: "close",
    icon: "icon-x",
    color: "transparent-primary",
  }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<EditComponent>,
    public permissions: PermissionBackend,
    public feed: FeedbackService,

  ) { }

  ngOnInit() { }

  actionClick($event) {
    if ($event == "close") {
      this.close();
    }
  }

  close() {
    this.dialog.close();
  }

  update(permission, level) {
    permission.level = level;

    this.permissions.update(this.data.league, permission).subscribe((res: ServerPayload) => {
      this.feed.finializeLoading(res, true);
    });
  }

}

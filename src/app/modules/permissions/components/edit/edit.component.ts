import { PermissionBackend } from './../../services/backend.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<EditComponent>,
    public permissions: PermissionBackend,
    public feed: FeedbackService,

  ) { }

  ngOnInit() { }

  close() {
    this.dialog.close();
  }

  update (permission, level) {
    permission.level = level;

    this.permissions.update(this.data.league, permission).subscribe((res: ServerPayload) => {
      this.feed.finializeLoading(res, true);
    });
  }

}

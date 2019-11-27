import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EditComponent } from 'src/app/modules/account/components/edit/edit.component';
import { PermissionBackend } from '../../services/backend.service';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { ServerPayload } from 'src/app/app.component';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.css']
})
export class RemoveComponent implements OnInit {

  recruit = this.data.permission;
  league = this.data.league;

  deleteConfirm: boolean = false;

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

  toggleDelete() {
    this.deleteConfirm = !this.deleteConfirm;
  }

  delete (permission) {
    permission.status = "rejected";

    this.permissions.update(this.data.league, permission).subscribe((res: ServerPayload) => {
      this.feed.finializeLoading(res, true);
      this.close();
    });
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { SessionBackend, Session } from '../../services/backend.service';
import { League } from 'src/app/modules/leagues/services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ServerPayload } from 'src/app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  public deleteConfirm: boolean = false;
  public league: League = this.data.league;
  public session: Session = this.data.session;
  
  constructor(
    public sessions: SessionBackend,
    public feed: FeedbackService,
    public dialog: MatDialogRef<DeleteComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  close () {
    this.dialog.close();
  }

  confirmDelete() {
    this.deleteConfirm = !this.deleteConfirm;
  }

  deleteLeague() {
    console.warn ("Delete Session.");

    this.sessions.delete(this.league, this.session).subscribe((res:ServerPayload)=>{
      this.feed.finializeLoading(res, true);
      
      console.log ("sessions.delete.response: ", res);

      if (res.status == "success") {
        
        this.close();
        this.router.navigate(["leagues", this.league.id]);
      }
    })
  }
}

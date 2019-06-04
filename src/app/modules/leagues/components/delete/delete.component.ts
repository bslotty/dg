import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { League, LeagueBackend } from '../../services/backend.service';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
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
  
  constructor(
    public leagues: LeagueBackend,
    public feed: FeedbackService,
    public dialog: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
  ) { }

  ngOnInit() { }

  close () {
    this.dialog.close();
  }

  confirmDelete() {
    this.deleteConfirm = !this.deleteConfirm;
  }

  deleteLeague() {
    console.warn ("Delete League.");

    this.leagues.delete(this.league).subscribe((res:ServerPayload)=>{
      this.feed.finializeLoading(res, true);
      
      console.log ("league.delete.response: ", res);

      if (res.status == "success") {
        this.router.navigate(["leagues"]);
        this.close();

      }
    })
  }

}

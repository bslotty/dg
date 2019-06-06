import { Component, OnInit } from '@angular/core';
import { Permission, PermissionBackend } from 'src/app/modules/permissions/services/backend.service';
import { League, LeagueBackend } from 'src/app/modules/leagues/services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { ServerPayload } from 'src/app/app.component';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { Router } from '@angular/router';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { loading } from 'src/app/animations';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [loading]
})
export class CreateComponent implements OnInit {

  public league: League = new League(this.route.snapshot.paramMap.get("league"));
  public pending: boolean = false;



  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public permissions: PermissionBackend,
    public account: AccountBackend,
    public feed: FeedbackService,
    public leagues: LeagueBackend,
  ) { }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.feed.initiateLoading();


    /*
    this.permissions.getList(this.league).subscribe((v: Permission[])=>{
      v.forEach((i:Permission)=>{
        if (i.user.id == this.account.user.id) {
          if (i.level == null) {
            this.pending = true;
          } else {
            this.router.navigate(["leagues", this.league.id]);
          }
        }
    });
    this.feed.finializeLoading();
    });
    */
  }

 

  joinRequest() {
    this.feed.initiateLoading();
    this.permissions.joinRequest(this.league).subscribe((res: ServerPayload) => {
      this.feed.finializeLoading(res, true);

      if (res.status == "success") {
        this.router.navigate(["leagues"]);
      }
    });
  }

}

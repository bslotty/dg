import { Component, OnInit } from '@angular/core';
import { SessionBackend } from '../../services/backend.service';
import { take, filter, map } from 'rxjs/operators';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { flyIn } from 'src/app/animations';
import { Observable } from 'rxjs';
import { Session } from 'src/app/shared/types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [flyIn]
})
export class DashboardComponent implements OnInit {


  //  recient: Session[];
  list: Session[];

  upcoming: Observable<Session[]>;
  recient: Observable<Session[]>;

  //  favorites: Session[]; 

  constructor(
    private sessionBackend: SessionBackend,
    private feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.feed.startElementTracking("session-upcoming");
    this.feed.startElementTracking("session-recient");

    //  Get List
    this.sessionBackend.listRecient();


    /*
    this.sessionBackend.getDetail(this.session);
    this.sessionBackend.detail$.subscribe((s) => {
      console.log("foundSession: ", s);
      this.session = s;
      this.sessionForm.setForm(s);

      if (this.session.created_by == this.accountBackend.user.id) {
        this.mode = "edit";
      } else {
        this.mode = "view";
      }
      
    });
    */

    var d = new Date().getTime();
    this.recient = this.sessionBackend.list$.pipe(
      map((a, i) => {
        return a.filter((s: Session) => d > new Date(s.starts_on).getTime());
      })
    );

    //  Get Upcoming; Sort by soonest; Limit 5
    this.upcoming = this.sessionBackend.list$.pipe(
      map((a, i) => {
        return a.filter((s: Session) => d < new Date(s.starts_on).getTime());
      })
    );
  }

}

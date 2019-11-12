import { Component, OnInit } from '@angular/core';
import { SessionBackend, Session } from '../../services/backend.service';
import { MatExpansionPanelDefaultOptions } from '@angular/material';
import { take } from 'rxjs/operators';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  upcoming: Session[];
  recient: Session[];


  //  favorites: Session[]; 

  constructor(
    private sessionBackend: SessionBackend,
    private feed: FeedbackService,
  ) { }

  ngOnInit() {
    this.feed.start("session-upcoming");
    this.feed.start("session-recient");

    //  Get List
    this.sessionBackend.listRecient();
    this.sessionBackend.list$.subscribe((s)=>{
      var d = new Date().getTime();

      //  Get Upcoming; Sort by soonest; Limit 5
      this.upcoming = s.filter((s: Session, i)=>{
        return d < new Date(s.starts_on).getTime();
      }).sort((a, b) => {
        return new Date(a.starts_on).getTime() - new Date(b.starts_on).getTime();
      }).slice(0, 2);
      this.feed.stop("session-upcoming");

      //  Recient; Limit 10
      this.recient = s.filter((s: Session)=>{
          return d > new Date(s.starts_on).getTime();
        }).slice(0, 5);
        this.feed.stop("session-recient");
      });

  }

  testAction() {
    console.log("action");
  }

}

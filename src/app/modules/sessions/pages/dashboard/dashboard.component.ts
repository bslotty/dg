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

  upcoming: Observable<Session[]>   = this._sessions.upcoming$;
  recient: Observable<Session[]>    = this._sessions.recient$;

  constructor(
    private _sessions: SessionBackend,
    private _feed: FeedbackService,
  ) { }

  ngOnInit() {
    this._feed.startElementTracking("session-upcoming");
    this._feed.startElementTracking("session-recient");

    //  Get List
    this._sessions.listCurrentSessions();

  }

}

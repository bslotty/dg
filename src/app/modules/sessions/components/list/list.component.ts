import { League } from './../../../leagues/services/backend.service';
import { SessionBackend, Session } from './../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { flyInPanelRow, flyIn } from 'src/app/animations';
import { MatDialog } from '@angular/material';
import { CreateComponent } from '../create/create.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-session-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [flyInPanelRow, flyIn],
})
export class ListComponent implements OnInit {

  league = new League(this.route.snapshot.paramMap.get("league"));
  createSessionMessage: Boolean = false;
  resolve: boolean = false;

  sessionList$: Session[];
  emptySessions: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public sessions: SessionBackend,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.populateData();
  }

  populateData() {

    this.sessions.getList(this.league).subscribe((sessions)=>{

      

      if (sessions.length == 0) {
        this.emptySessions = true;
      } else {
        //  Sort
        this.sessionList$ = sessions.sort((a, b) => {
          return b["start"] - a["start"];
        });
      }

      this.resolve = true;
    });
  }

  itemTrackBy(index: number, item) {
    return item.id;
  }

  createSession() {
    const diagRef = this.dialog.open(CreateComponent, {
      data: { league: this.league }
    });

    diagRef.afterClosed().subscribe(()=>{
      this.populateData();
    });
  }
}

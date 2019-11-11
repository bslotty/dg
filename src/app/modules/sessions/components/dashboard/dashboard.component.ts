import { Component, OnInit } from '@angular/core';
import { SessionBackend, Session } from '../../services/backend.service';
import { MatExpansionPanelDefaultOptions } from '@angular/material';

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
    private sessionBackend: SessionBackend
  ) { }

  ngOnInit() {

    //  Get List
    this.sessionBackend.listRecient();
    this.sessionBackend.list$.subscribe((s)=>{
      var d = new Date().getTime();

      this.upcoming = s.filter((s: Session)=>{
        return d < new Date(s.starts_on).getTime();
      });

      this.recient = s.filter((s: Session)=>{
        return d > new Date(s.starts_on).getTime();
      });
    });

  }

  testAction() {
    console.log("action");
  }

}

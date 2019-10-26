import { Component, OnInit } from '@angular/core';
import { SessionBackend, Session } from '../../services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  list: Session[];
  
  constructor(
    private sessionBackend: SessionBackend
  ) { }

  ngOnInit() {

    this.sessionBackend.getList();
    this.sessionBackend.list$.subscribe((s)=>{
      this.list = s;
    });

  }



}

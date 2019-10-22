import { Component, OnInit } from '@angular/core';
import { SessionBackend } from '../../services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  
  constructor(
    private sessionBackend: SessionBackend
  ) { }

  ngOnInit() { }



}

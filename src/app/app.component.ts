import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { flyIn, flyLeft, flyRight } from 'src/app/animations';
import { AccountBackend } from './modules/account/services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [flyIn, flyRight, flyLeft],
})

export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private account: AccountBackend,
  ) { }

  ngOnInit() { }

  getRoute(outlet) {}
}


export class ServerPayload {
  public status: string;
  public msg: string;
  public data: Array<any>;
}
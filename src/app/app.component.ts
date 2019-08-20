import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { fade, flyIn } from 'src/app/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fade, flyIn],
})

export class AppComponent {  

  public width = window.innerWidth;

  constructor(
    private router: Router,
  ){ }

  getRoute(outlet) {
    return this.router.url;
  }
}


export class ServerPayload {
  public status: string;
  public msg: string;
  public data: Array<any>;
}
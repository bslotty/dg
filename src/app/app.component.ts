import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { flyIn, flyLeft, flyRight } from 'src/app/animations';
import { AccountBackend } from './modules/account/services/backend.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [flyIn, flyRight, flyLeft],
})

export class AppComponent implements OnInit {

  private crumbs: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private account: AccountBackend,
  ) { }

  ngOnInit() {

    //  Show/Hide Breadcrumb Nav from URL
    this.router.events.subscribe((r)=>{

      if (this.location.path() != "/home") {
        this.crumbs = true;
      } else {
        this.crumbs = false;
      }
      
      //  console.warn("crumbs?", this.location.path(), this.crumbs);
    });

  }

  getRoute(outlet) {}
}


export class ServerPayload {
  public status: string;
  public msg: string;
  public data: Array<any>;
}
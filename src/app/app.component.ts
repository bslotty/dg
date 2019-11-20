import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { flyIn, flyLeft, flyRight } from 'src/app/animations';
import { AccountBackend } from './modules/account/services/backend.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [flyIn, flyRight, flyLeft],
})

export class AppComponent implements OnInit {


  private activeRoute: BehaviorSubject<string> = new BehaviorSubject('');
  activeRoute$: Observable<string> = this.activeRoute.asObservable().pipe(
    //  debounceTime(100),
    distinctUntilChanged()
  );

  r:string; // Observable giving ngIf Errors; Workaround -1pts

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private account: AccountBackend,
  ) { }

  ngOnInit() {
    this.activeRoute$.subscribe((v) => {
      console.log("route:", v);
      this.r = v;
    })

  }

  getRoute(outlet) {

    if (this.router.url.indexOf("courses") > -1) {
      this.activeRoute.next("Courses");
    } else if (this.router.url.indexOf("sessions") > -1) {
      this.activeRoute.next("Sessions");
    } else if (this.router.url.indexOf("login") > -1) {
      this.activeRoute.next("Login");
    } else if (this.router.url.indexOf("account") > -1) {
      this.activeRoute.next("Account");
    }
  

  }
}


export class ServerPayload {
  public status: string;
  public msg: string;
  public data: Array<any>;
}
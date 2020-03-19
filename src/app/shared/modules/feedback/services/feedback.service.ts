import { Injectable, OnInit, ErrorHandler } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ServerPayload } from 'src/app/app.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { delay } from 'rxjs/internal/operators/delay';
import { timeout } from 'rxjs/internal/operators/timeout';
import { FeedbackErrorHandler } from 'src/app/shared/types';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService implements OnInit {

  loading: boolean = true;

  error: boolean = false;
  errorMsg: string = "";
  retryObs: Observable<any>;
  attempts: number = 0;

  list: BehaviorSubject<string[]> = new BehaviorSubject([]);
  list$: Observable<string[]> = this.list.asObservable();

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    //  Reset Error Message upon Router Change
    //    Change on End, After all checks;
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.loading = false;
      }

      //  Test and possibly remove
      //  Automatic Loading when route loads;
      if (e instanceof NavigationStart) {
        this.clearErrors();
      }


    });
  }

  ngOnInit() { }

  clearErrors() {
    this.error = false;
    this.attempts = 0;
  }


  setErrorMsg(error: string) {
    this.error = true;
    this.attempts++;
    this.errorMsg = error;
  }




  //  New Functions for section specific loading; Observable Edition
  stopElementTracking(str: string): void {
    //  Current List
    let list = this.list.value;

    //  If Exists; Pop
    let i = list.indexOf(str);
    if (i > -1) {
      list.splice(i, 1);
    }

    //  Emit Updates
    this.list.next(list);
  }

  startElementTracking(str: string): void {
    //  Current List
    let list = this.list.value;

    //  If Not In; Push
    if (list.indexOf(str) == -1) {
      list.push(str);
    }

    //  Emit Updates
    this.list.next(list);
  }





  /**
   * @event REST Callback with result of error
   * To tie in with message component for form
   * feedback
   */
  toast(payload: ServerPayload) {
    //  Scale Duration based on message length
    var length = payload.msg.length;
    var scale = (length * 2) / 1000;
    var duration = 3000 * (scale + 1);

    this.snackBar.open(payload.msg, "Close", {
      panelClass: payload.status,
      duration: duration * 1.3,
      verticalPosition: "top"
    });
  }

  1111

}

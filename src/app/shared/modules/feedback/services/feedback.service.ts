import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ServerPayload } from 'src/app/app.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService implements OnInit {

  loading: boolean = true;

  error: boolean = false;
  errorHandler: HttpErrorResponse;
  retryObs: Observable<any>;
  attempts: number = 0;

  list: BehaviorSubject<string[]> = new BehaviorSubject([]);
  list$: Observable<string[]> = this.list.asObservable();

  pColor: string = "primary";
  pMode: string = "determinate"
  pValue: string = "100";

  feedbackMessage: string;

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
        this.loading = true;
        this.reset();
      }


    });

    //  Load Upon Router Start? //  End?
  }

  ngOnInit() {
    this.feedbackMessage = "";


    
  }

  reset() {
    this.error = false;
    this.attempts = 0;
  }

  retry() {
    this.error = false;
    this.retryObs.subscribe((retry)=>{
      console.log("retry: ", retry);
    });
  }


  //  New Functions for section specific loading; Observable Edition
  stop(str: string): void {
    //  Current List
    var list = this.list.value;

    //  If Exists; Pop
    let i = list.indexOf(str);
    if (i > -1) {
      list.splice(i, 1);
    }

    //  Emit Updates
    this.list.next(list);
  }

  start(str: string): void {
    //  Current List
    var list = this.list.value;

    //  If Not In; Push
    if (list.indexOf(str) == -1){
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

  /**
   * @event REST Callback with result of error
   * To tie in with message component for form
   * feedback
   */
  setMessage(payload: ServerPayload) {
    this.feedbackMessage = payload.msg;
  }

  /**
   * @deprecated
   */
  initiateLoading() {
    this.loading = true;

    this.pColor = "primary";
    this.pMode = "indeterminate";
    this.pValue = "0";
  }


  /**
   * @deprecated
   */
  finializeLoading(payload = null, toast: boolean = false) {
    if (payload) {
      if (toast == true) {
        this.setMessage(payload);
      }
      this.pColor = payload.status == "success" ? "primary" : "warn";
    }

    this.pValue = "100";
    this.pMode = "determinate";
    this.loading = false;
  }

}

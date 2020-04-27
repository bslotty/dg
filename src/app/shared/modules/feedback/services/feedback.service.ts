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


  //  loading: boolean = true;


  //  Bank of elements that have errors
  private list: BehaviorSubject<FeedbackErrorHandler[]> = new BehaviorSubject([]);
  list$: Observable<FeedbackErrorHandler[]> = this.list.asObservable();

  private loading: BehaviorSubject<string[]> = new BehaviorSubject([]);
  loading$: Observable<string[]> = this.loading.asObservable();


  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() { }



  /*
  
      Error Message Functions
  */
  hasError(elementName: string): boolean | FeedbackErrorHandler {
    let tracked = this.list.value.find(e => { e.element == elementName });
    
    if (tracked != undefined) {
      return tracked;
    } else {
      return false;
    }
    
  }

  clearError(elementName: string): void {

    //  FilterList
    let list = this.list.value.filter(e => {
      return e.element != elementName;
    });

    //  Emit Updates
    this.list.next(list);
  }

  setError(elementName: string, message: string): void {
    //  Dont add an already existing
    let list = this.list.value;
    let found = list.filter(e => {
      return e.element == elementName;
    });

    //  console.warn ("ErrorList: ", list);
    //  console.log ("found:  ", found);

    //  If Not In; Push
    if (found.length == 0) {
      let feed = new FeedbackErrorHandler()
      feed.element = elementName;
      feed.msg = message;

      list.push(feed);
    }

    //  Emit Updates
    this.list.next(list);
  }




  /*
    
      Loading Functions
  */
  isLoading(actionName: string): boolean {
    let tracked = this.list.value.find(e => { e.element == actionName });
    return tracked != undefined;
  }

  startLoading(actionName: string): void {
    //  Dont add an already existing
    let list = this.loading.value;

    if (list == undefined) {
      list = [actionName];
    } else {
      let found = list.filter(e => {
        return e == actionName;
      });


      //  If Not In; Push
      if (found != undefined) {
        list.push(actionName);
      }
    }



    //  Emit Updates
    this.loading.next(list);
  }

  stopLoading(actionName: string): void {

    //  FilterList
    let list = this.loading.value.filter(e => {
      return e != actionName;
    });

    //  Emit Updates
    this.loading.next(list);
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







}




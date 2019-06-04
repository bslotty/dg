import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { ServerPayload } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  public loading: number = 1;
  

  public pColor: string  = "primary";
  public pMode:  string  = "determinate"
  public pValue: string  = "100";

  constructor(
    public snackBar: MatSnackBar
  ) { }


  setMessage(payload: ServerPayload) {
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


  initiateLoading() {
    this.loading = 1;

    this.pColor = "primary";
    this.pMode = "indeterminate";
    this.pValue = "0";
  }


  finializeLoading(payload = null, toast: boolean = false) {
    if (payload) {
      if (toast == true) {
        this.setMessage(payload);
      }
      this.pColor = payload.status == "success" ? "primary" : "warn";
    }

    this.pValue = "100";
    this.pMode = "determinate";
    this.loading = 0;
  }

}

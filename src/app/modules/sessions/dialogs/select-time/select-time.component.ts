import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionBackend } from '../../services/backend.service';
import { skip } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { SessionFormService } from '../../services/form.service';
import { combineLatest } from 'rxjs';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { NgxMaterialTimepickerContainerComponent } from 'ngx-material-timepicker/src/app/material-timepicker/components/ngx-material-timepicker-container/ngx-material-timepicker-container.component';


@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.scss']
})
export class SelectTimeComponent implements OnInit {

  private form: FormGroup;
  private dataUpdated: boolean = false;


  /*
    $theme-font-header: 'Montserrat', serif;
    $theme-font-body: 'Roboto';
    $theme-font-utility: 'Montserrat';


    //  Colors
    $theme-primary: #fafaf0;
    $theme-accent: #4FD3FF;
    $theme-warn: #ffd133;

    $theme-secondary: #506450;
    $theme-error: #ffd133;

    //  Backgrounds
    $theme-bg-dark: #222422;
    $theme-bg-dark-surface: #506450;

    $theme-bg-light: #222422;
    $theme-bg-light-surface: #506450;


    // Text
    $theme-text-light: #fafaf0;
    $theme-text-dark: #1e2616;
  */

  //  Clock Theme
  private timeTheme: NgxMaterialTimepickerTheme = {
    container: {
      primaryFontFamily: "--primary-font-family: 'Montserrat'",
      bodyBackgroundColor: "",
      buttonColor: "",
    },
    clockFace: {
      clockFaceBackgroundColor: "",
      clockFaceInnerTimeInactiveColor: "",
      clockFaceTimeActiveColor: "",
      clockFaceTimeDisabledColor: "",
      clockFaceTimeInactiveColor: "",
      clockHandColor: "",
    },
    dial: {
      dialActiveColor: "",
      dialBackgroundColor: "",
      dialEditableActiveColor: "",
      dialEditableBackgroundColor: "",
      dialInactiveColor: "",
    }
  }

  constructor(
    private dialogRef: MatDialogRef<SelectTimeComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private sessions_: SessionBackend,
    private sessionsF_: SessionFormService) { }

  ngOnInit() {
    this.sessionsF_.form$.subscribe((f) => {
      this.form = f;
    });

    this.sessions_.detail$.pipe(skip(1)).subscribe((s) => {
      this.close();
    });
  }

  setTime() {
    if (this.form.get('date').valid && this.form.get('time').valid) {
      this.sessions_.setDate(this.form.get('date').value, this.form.get('time').value);
      this.dataUpdated = true;
    }
  }


  close() {
    this.dialogRef.close(this.dataUpdated);
  }

}

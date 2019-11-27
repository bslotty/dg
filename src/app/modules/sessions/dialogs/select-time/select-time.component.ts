import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionBackend } from '../../services/backend.service';
import { skip } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { SessionFormService } from '../../services/form.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.scss']
})
export class SelectTimeComponent implements OnInit {

  private form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SelectTimeComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private sessions_: SessionBackend,
    private sessionsF_: SessionFormService) { }

  ngOnInit() {
    this.sessionsF_.form$.subscribe((f) => {
      this.form = f;
    });

    combineLatest(
      this.form.get('date').valueChanges,
      this.form.get('time').valueChanges,
    ).subscribe((date) => {
      console.log("TimeEmmitted: ", date);

      // this.sessions_.setDate(date[0], date[1]);
    });


    this.sessions_.detail$.pipe(skip(1)).subscribe((s) => {
      this.close();
    });
  }

  setTime() {
    if (this.form.get('date').valid && this.form.get('time').valid) {
      this.sessions_.setDate(this.form.get('date').value, this.form.get('time').value);
    }
  }


  close(bool = false) {
    this.dialogRef.close(bool);
  }

}

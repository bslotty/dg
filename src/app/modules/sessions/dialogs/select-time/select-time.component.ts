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
  private dataUpdated: boolean = false;

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

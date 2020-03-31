import { Component, OnInit, Input, Inject } from '@angular/core';
import { flyIn } from 'src/app/animations';
import { SessionBackend } from '../../services/backend.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { skip } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-select-format',
  templateUrl: './select-format.component.html',
  styleUrls: ['./select-format.component.scss'],
  animations: [flyIn],
})
export class SelectFormatComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<SelectFormatComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private _sessions: SessionBackend,
    private _helper: HelperService,
  ) { }

  ngOnInit() {
    this._sessions.detail$.pipe(skip(1)).subscribe((s)=>{
      this.close();
    });
  }

  setFormat(format) {
    this._sessions.setFormat(format);
    this.close(true);
  }


  close(bool = false) {
    this.dialogRef.close(bool);
  }

}
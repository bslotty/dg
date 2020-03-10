import { Component, OnInit, Input, Inject } from '@angular/core';
import { flyIn } from 'src/app/animations';
import { SessionBackend } from '../../services/backend.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { skip } from 'rxjs/operators';

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
    private sessions_: SessionBackend,
  ) { }

  ngOnInit() {
    this.sessions_.detail$.pipe(skip(1)).subscribe((s)=>{
      this.close();
    });
  }

  setFormat(format) {
    this.sessions_.setFormat(format);
    this.close(true);
  }


  close(bool = false) {
    this.dialogRef.close(bool);
  }

}
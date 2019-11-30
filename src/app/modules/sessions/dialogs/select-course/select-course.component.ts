import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionBackend } from '../../services/backend.service';
import { flyIn } from 'src/app/animations';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-select-course',
  templateUrl: './select-course.component.html',
  styleUrls: ['./select-course.component.scss'],
  animations: [flyIn]
})
export class SelectCourseComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<SelectCourseComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private sessions_: SessionBackend,
  ) { }

  ngOnInit() {

    //  Close When Course is Updates
    this.sessions_.detail$.pipe(skip(1)).subscribe((s)=>{
      this.close();
    });
  }

  close(bool = false) {
    this.dialogRef.close(bool);
  }

}

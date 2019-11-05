import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'score-settings',
  templateUrl: './score-settings.component.html',
  styleUrls: ['./score-settings.component.scss']
})
export class ScoreSettingsComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ScoreSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.builder.group({
      handicap: [this.data.handicap || "", [Validators.required]]
    });

    console.log("data: ", this.data);
  }

  close(bool) {
    this.dialogRef.close(bool);
  }

  formCheck(){
    if (this.form.valid && this.form.dirty && !this.form.disabled){
      return true;
    } else {
      return false;
    }
  }

  save() {
    if (this.form.valid && this.form.dirty && !this.form.disabled) {
      this.data.handicap = this.form.get('handicap').value;

      this.dialogRef.close(true);
    }
  }

}

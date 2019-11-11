import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionFormService } from 'src/app/modules/sessions/services/form.service';

@Component({
  selector: 'team-settings',
  templateUrl: './team-settings.component.html',
  styleUrls: ['./team-settings.component.scss']
})
export class TeamSettingsComponent implements OnInit {

  form: FormGroup
  colorList = this.sessionForm.teamColorList;

  constructor(
    private dialogRef: MatDialogRef<TeamSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private builder: FormBuilder,
    private sessionForm: SessionFormService,
  ) { }


  ngOnInit() {
    this.form = this.builder.group({
      name: [this.data.name, [Validators.minLength(1)]]
    });

    console.log("data: ", this.data);
    console.log("dialog.colorList: ", this.colorList);
  }

  close(bool) {
    this.dialogRef.close(bool);
  }

  formCheck() {
    if (this.form.valid && this.form.dirty && !this.form.disabled) {
      return true;
    } else {
      return false;
    }
  }

  save() {
    if (this.form.valid && this.form.dirty && !this.form.disabled) {
      this.data.name = this.form.get('name').value;

      this.dialogRef.close(true);
    }
  }

  pickColor(color) {
    if (color.available) {
      this.form.markAsDirty();
      this.data.color = color;
    }

  }


}
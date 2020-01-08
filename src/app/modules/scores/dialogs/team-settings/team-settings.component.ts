import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionFormService } from 'src/app/modules/sessions/services/form.service';
import { ScoresBackend } from '../../services/backend.service';

@Component({
  selector: 'team-settings',
  templateUrl: './team-settings.component.html',
  styleUrls: ['./team-settings.component.scss']
})
export class TeamSettingsComponent implements OnInit {

  form: FormGroup
  colorList = this._scores.teamColorList;

  constructor(
    private dialogRef: MatDialogRef<TeamSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private builder: FormBuilder,
    private _scores: ScoresBackend,
  ) { }


  ngOnInit() {
    this.form = this.builder.group({
      name: [this.data.name, [Validators.minLength(1)]]
    });
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
    if (color.available && color !== this.data.color) {
      this.form.markAsDirty();

      //  Update Availablity
      this._scores.teamColorList.forEach((c) => {
        //  Restrict new
        if (c.name == color.name) {
          c.available = false;
        }

        //  Allow Old
        if (c.name == this.data.color.name) {
          c.available = true;
        }
      });

      //  Update roster with new team Info;
      this._scores.updateRosterTeam(this.data.color, color);

      //  Update Team Color
      this.data.color = color;
    }

  }


}
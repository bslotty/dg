import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { ScoresBackend } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class ScoresFormService {

  private form: BehaviorSubject<FormGroup> = new BehaviorSubject(undefined);
  form$: Observable<FormGroup> = this.form.asObservable();


  private cTerm = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(128)
  ]);


  constructor(
    private builder: FormBuilder,
    private feed: FeedbackService,

    private _scores: ScoresBackend,
  ) { }


  Setup(type) {

    var form = this.builder.group({});

    switch (type) {
      case "search":
        form.addControl("search", this.cTerm);

        //  Listen to Input changes to trigger loading and search
        form.get("search").valueChanges.pipe(this._scores.serverPipe).subscribe((s) => {
          if (form.valid) {
            this.feed.loading = true;
            this._scores.getSearch(s as string);
          }
        });

        //  Turn off Loader when Results populate
        this._scores.searchedPlayers$.subscribe((s) => {
          this.feed.loading = false;
        });
        break;
    }

    this.form.next(form);

  }

  resetPlayerSearch() {
    this.form.value.get("search").reset();
  }



}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CourseBackend } from '../../courses/services/backend.service';
import { Router } from '@angular/router';
import { Session, SessionBackend, SessionFormat } from './backend.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AccountBackend } from '../../account/services/backend.service';
import { Team } from '../../stats/services/backend.service';
import { ScoresBackend, TeamColor } from '../../scores/services/backend.service';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionFormService {

  private form: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
  form$: Observable<FormGroup> = this.form.asObservable();

  private teams: BehaviorSubject<Team[] | undefined> = new BehaviorSubject(undefined);
  teams$: Observable<Team[]> = this.teams.asObservable();

  builder: FormBuilder = new FormBuilder;

  initialized: boolean = false;

  /*
  public starts_on?: Date,
  public title?: string,
  public par?: Array<any>,
  public players?: Player[],
  */

  //  Form Field Control Setup;
  private cFormat = new FormControl("", [
    Validators.required
  ]);

  private cCourse = new FormControl("", [
    Validators.required,
  ]);

  private cDate = new FormControl("", {
    updateOn: "blur", validators: [
      Validators.required,
      //  Validators.pattern("(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)")
    ]
  });

  private cTime = new FormControl("", {
    updateOn: "blur", validators: [
      Validators.required,
      //  Validators.pattern("((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))")
    ]
  });

  private cPlayers = new FormArray([], [
    Validators.required
  ]);

  private cTeams = new FormArray([], [
    /*  If not FFA Then apply;
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(8),
    */
  ]);

  private cScores = new FormArray([], [
    Validators.required,
    Validators.minLength(1),
  ]);

  private cTerm = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(128)
  ]);


  constructor(
    private helper: HelperService,
    private courseService: CourseBackend,
    private session_: SessionBackend,
    private scoresService: ScoresBackend,
    private accountService: AccountBackend,
    private router: Router) {

    //  Get Data & Populate
    this.session_.detail$.subscribe((s) => {

      if (typeof s.format == "string") {
        //  Format
        s.format = this.getFormatFromName(s.format);
      }

      if (s != undefined) {
        this.setForm(s);
      }

    });
  }

  teamGame(): boolean {
    var res: boolean = this.form.value.get('format').valid && this.form.value.get('format').value.enum.indexOf("team") > -1;
    console.log("teamGame?: ", res);

    return res;
  }


  Setup(type) {

    var form = this.builder.group({});

    switch (type) {
      case "create":
        form.addControl("format", this.cFormat);
        form.addControl("course", this.cCourse);
        form.addControl("date", this.cDate);
        form.addControl("time", this.cTime);
        form.addControl("scores", this.cScores);
        form.addControl("teams", this.cTeams);
        break;

      case "edit":
        form.addControl("format", this.cFormat);
        form.addControl("course", this.cCourse);
        form.addControl("date", this.cDate);
        form.addControl("time", this.cTime);
        form.addControl("scores", this.cScores);
        form.addControl("teams", this.cTeams);
        break;

      case "search":
        form.addControl("", this.cTerm);
        break;
    }


    //  Push Initial Form
    this.form.next(form);
  }

  /**
  *  @returns boolean
  *  Form needs to be Valid, Touched, and not Disabled.
  */
  ReadyForSubmission(): boolean {
    if (this.form.value.valid && this.form.value.dirty && !this.form.value.disabled) {


      if (this.teamGame()) {
        if (this.validateRoster()) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }

    } else {
      return false;
    }
  }

  resetForm(): void {
    this.form.value.get("format").reset();
    this.form.value.get("course").reset();
    this.form.value.get("date").reset();
    this.form.value.get("time").reset();
    this.form.value.get("scores").reset();
    this.form.value.get("teams").reset();
  }


  setForm(values): void {

    //  Course
    if (values.course != undefined) {
      this.form.value.get("course").setValue(values.course);
    }


    //  Date/Time
    if (values.starts_on != undefined) {
      this.setDate(values.starts_on);
    }

    if (values.format != undefined) {
      this.form.value.get("format").setValue(values.format);
    }


    //  Players
    if (values.scores != undefined) {
      values.scores.forEach((s, i) => { this.scoreList.push(new FormControl(s)) });

      //  Teams
      if (values.format && values.format.enum.indexOf("team") > -1) {
        var uTeams = this.scoresService.getTeamsFromScoreList(values.scores);
        uTeams.forEach((t, i) => { this.teamList.push(new FormControl(t)); });
      }

    }
  }



  getFormatFromName(str: string | SessionFormat) {
    if (str instanceof SessionFormat) {
      return str;
    } else {
      var format = this.session_.types.find((t) => {
        if (t.enum == str) {
          return true;
        }
      });
      return format;
    }
  }

  setFormat(format) {
    this.form.value.get("format").setValue(format);
  }

  setCourse(course) {
    this.form.value.get("course").setValue(course);
  }

  setDate(date: Date): void {
    var date = new Date(date);
    this.form.value.get("date").setValue(date);
    this.form.value.get("time").setValue(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(":00 ", " "));
  }

  validateDate(): void {
    this.form.value.get("date").updateValueAndValidity();
    this.form.value.get("time").updateValueAndValidity();
  }





  //  Score Functions
  get scoreList() {
    return this.form.value.get('scores') as FormArray;
  }

  get teamList() {
    return this.form.value.get('teams') as FormArray;
  }

  addScore(score) {
    var dupe = false;
    this.scoreList.controls.forEach((v, i) => {
      if (v.value.id == score.player.id) {
        dupe = true;
      }
    });

    if (!dupe) {
      this.scoreList.push(new FormControl(score));
    }
  }

  removeScore(score) {
    this.scoreList.controls.forEach((v, i) => {
      if (score.player.id == v.value.id) {
        this.scoreList.removeAt(i);
      }
    });
  }


  submitCreation() {
    console.log("SubmitCreation.form: ", this.form);

    var session;
    this.session_.detail$.subscribe(s => session = s);

    //  session.starts_on = this.form.value.value.date.toISOString();

    this.session_.create(session).subscribe((res) => {
      if (this.helper.rCheck(res)) {

        var session = this.helper.rGetData(res)[0];
        this.router.navigate(["/sessions", session['id']]);
      }
    });

  }


  validateRoster(): boolean {
    var valid = true;
    this.scoreList.controls.forEach((s) => {
      if (s.value.team == null || s.value.team == undefined    || s.value.team.name == "unassigned") {
        valid = false;
      }
    });
    return valid;
  }











}

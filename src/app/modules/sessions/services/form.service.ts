import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CourseBackend } from '../../courses/services/backend.service';
import { Router } from '@angular/router';
import { Session, SessionBackend } from './backend.service';
import { HelperService } from 'src/app/shared/services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class SessionFormService {

  private form: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
  form$: Observable<FormGroup> = this.form.asObservable();

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

  private cDate = new FormControl("", [
    Validators.required,
  ]);

  private cTime = new FormControl("", [
    Validators.required,
  ]);

  private cPlayers = new FormArray([], [
    Validators.required,
  ]);

  private cTeams = new FormArray([], [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(8),
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


  //  Team Colors
  teamColorList = [{
    name: "red",
    hex: "ad0000",
    available: true,
  }, {
    name: "blue",
    hex: "3052ff",
    available: true,
  }, {
    name: "green",
    hex: "30ff30",
    available: true,
  }, {
    name: "yellow",
    hex: "fcf22f",
    available: true,
  }, {
    name: "orange",
    hex: "fcad2e",
    available: true,
  }, {
    name: "purple",
    hex: "802efc",
    available: true,
  }, {
    name: "pink",
    hex: "fc2eea",
    available: true,
  }, {
    name: "white",
    hex: "FFFFFF",
    available: true,
  },];

  constructor(
    private helper: HelperService,
    private courseService: CourseBackend,
    private sessionService: SessionBackend,
    private router: Router) { }

  Setup(type) {

    var form = this.builder.group({});

    switch (type) {
      case "create":
        form.addControl("format", this.cFormat);
        form.addControl("course", this.cCourse);
        form.addControl("date", this.cDate);
        form.addControl("time", this.cTime);
        form.addControl("scores", this.cScores);
        break;

      case "edit":
        form.addControl("format", this.cFormat);
        form.addControl("course", this.cCourse);
        form.addControl("date", this.cDate);
        form.addControl("time", this.cTime);
        form.addControl("scores", this.cScores);
        break;

      case "search":
        form.addControl("", this.cTerm);
        break;
    }

    if (type != 'search') {
      //  Listen to Changes for Date Time Merge
      form.valueChanges.pipe(this.sessionService.serverPipe).subscribe((v) => {
        if (v['time'] != "" && v['date'] instanceof Date && v['date'].getHours() == 0) {
          var d = new Date(v['date'].toDateString() + " " + v['time']);
          console.log("date set: ", d);
          this.setDate(d);
        }
      });
    }



    this.form.next(form);
  }

  /**
  *  @returns boolean
  *  Form needs to be Valid, Touched, and not Disabled.
  */
  ReadyForSubmission(): boolean {
    if (this.form.value.valid && this.form.value.dirty && !this.form.value.disabled) {


      if (this.form.value.get('format').value.enum != 'ffa') {
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
  }

  setForm(values): void {
    this.form.value.get("format").setValue(values.format);
    this.form.value.get("course").setValue(values.course);

    //  Date/Time
    var date = new Date(values.date).toLocaleDateString();
    var time = new Date(values.date).toLocaleTimeString();
    this.form.value.get("date").setValue(date);
    this.form.value.get("time").setValue(time);

    //  Players
    this.form.value.get("scores").setValue(values.scores);
    this.form.value.markAsDirty();

  }

  setFormat(format) {
    this.form.value.get("format").setValue(format);
    //  If Format Changes to/from FFA; Update Controls(Team)

    if (format.enum == "ffa" && this.form.value.get('teams')) {
      this.form.value.removeControl("teams");
      this.form.value.removeControl("roster");
    } else if (format.enum != "ffa" && !this.form.value.get('teams')) {
      this.form.value.addControl("teams", this.cTeams);
      this.form.value.addControl("scores", this.cScores);
    }
  }

  setCourse(course) {
    this.form.value.get("course").setValue(course);
  }

  setDate(date) {
    this.form.value.get("date").setValue(date);
  }


  //  Score Functions
  get scoreList() {
    return this.form.value.get('scores') as FormArray;
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

  removeScore(player) {
    this.scoreList.controls.forEach((v, i) => {
      if (player.id == v.value.id) {
        this.scoreList.removeAt(i);
      }
    });
  }


  //  Team Functions
  get teamList() {
    return this.form.value.get('teams') as FormArray;
  }

  addTeam() {

    //  Limit to 8
    if (this.teamList.controls.length < 8) {
      var color = this.teamColorList.find((t) => {
        return t.available == true;
      });

      //  Disable Color
      color.available = false;

      this.teamList.push(new FormControl({
        name: color.name,
        color: color,
      }));

    } else {
      // Too Many
    }

  }

  removeTeam(team) {
    this.teamList.controls.forEach((v, i) => {
      if (team.name == v.value.name) {

        //  Update Availablity Status on Color
        this.teamColorList.find((c) => {
          if (c.name == team.name) {
            c.available = true;
            return true;
          }
        });

        //  Remove Team From List
        this.teamList.removeAt(i);
      }
    });

    //  Remove Roster for Deleted Team
    this.scoreList.controls.forEach((s, i) => {
      if (s.value.team == team) {
        s.value.team = null;
      }
    });
  }



  submitCreation() {
    console.log("SubmitCreation.form: ", this.form);

    var session = this.getSessionFromForm();

    this.sessionService.create(session).subscribe((res) => {
      console.log("sessionsService.create.res: ", res);
      if (this.helper.rCheck(res)) {

        var session = this.helper.rGetData(res)[0];
        console.log("submitCreation.session: ", session);
        this.router.navigate(["/sessions", session['id']]);
      }
    });

  }



  getSessionFromForm(): Session {
    var session = new Session();
    session.format = this.form.value.value.format;
    session.course = this.form.value.value.course;
    session.starts_on = this.form.value.value.date.toISOString();
    session.scores = this.scoreList.value;

    return session;
  }





  validateRoster(): boolean {
    var valid = true;
    this.scoreList.controls.forEach((s) => {
      if (s.value.team == null || s.value.team == undefined) {
        valid = false;
      }
    });
    return valid;
  }











}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CourseBackend } from '../../courses/services/backend.service';
import { Router } from '@angular/router';
import { Session, SessionBackend, SessionFormat } from './backend.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AccountBackend } from '../../account/services/backend.service';
import { Team } from '../../stats/services/backend.service';

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

  private cDate = new FormControl("", {updateOn: "change", validators: [
    Validators.required,
  ]});

  private cTime = new FormControl("", {updateOn: "change", validators: [
    Validators.required,
  ]});

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
    private accountService: AccountBackend,
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
        form.addControl("teams", this.cTeams);
        break;

      case "edit":
        form.addControl("format", this.cFormat);
        form.addControl("course", this.cCourse);
        form.addControl("date", this.cDate);
        form.addControl("time", this.cTime);
        form.addControl("scores", this.cScores);
        form.addControl("teams", this.cTeams);

        //  Get Data & Populate
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
          console.log("date set: ", d, v);
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
    this.form.value.get("teams").reset();
  }
  
  resetCourse() {
    this.courseService.resetList();
    this.form.value.get("course").reset();
  }

  setForm(values): void {
    console.log ("new values for form: ", values);


    //  If these are not proper formats -> get

    if (values.format instanceof SessionFormat) {
      this.form.value.get("format").setValue(values.format);
    } else {
      var type = this.getFormatFromName(values.format);
      this.form.value.get("format").setValue(type);
    }
    
    this.form.value.get("course").setValue(values.course);

    //  Date/Time
    var time = new Date(values.starts_on).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true });
    var date = new Date(values.starts_on);
    this.form.value.get("date").setValue(date);
    this.form.value.get("time").setValue(time);

    //  Players
    if (values.scores == undefined) {
      this.getScores();
    } else {
      console.log ("WHY IS SCORES UNAVAILABLE: ", values.scores, this.form.value);
      /*
      var arrayHelper = this.form.value.get('scores') as FormArray;
      arrayHelper.push(values.scores);
      */
      this.form.value.get('scores').setValue(values.scores);
    }
    
    this.form.value.markAsDirty();

  }



  getFormatFromName(str) {
    var format = this.sessionService.types.find((t)=>{
      if (t.enum == str) {
        return true;
      }
    });

    console.log ("found Format: ", format);
    return format;
  }

  setFormat(format) {
    this.form.value.get("format").setValue(format);
  }

  setCourse(course) {
    console.log("setCourse: ", course);
    this.form.value.get("course").setValue(course);
    this.courseService.resetList();
  }

  setDate(date: Date): void {
    console.log ("date?");

    this.form.value.get("date").setValue(date);
    this.form.value.get("time").setValue(date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true }));
  }

  getScores() {
    //  To be called if scores == undefined;
    console.warn("GET THOSE SCORES");
    this.sessionService.getScores();
    
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
    /*
    if (this.scoreList.controls.length > 0 && this.roster.length == 0) {
      this.roster[0] = this.scoreList.value;
    } else if (this.roster.length < this.teamList.length) {
      this.roster.push([]);
    }
    */


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


  getTeamsFromScores() {

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
    session.created_by = this.accountService.user.id
    session.created_on = new Date();
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

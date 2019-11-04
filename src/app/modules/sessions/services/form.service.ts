import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CourseBackend, Course } from '../../courses/services/backend.service';
import { Router } from '@angular/router';
import { Session, SessionBackend, Score } from './backend.service';
import { Team } from '../../stats/services/backend.service';

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
    Validators.minLength(1)
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
        form.addControl("players", this.cPlayers);
        break;

      case "edit":
        form.addControl("format", this.cFormat);
        form.addControl("course", this.cCourse);
        form.addControl("date", this.cDate);
        form.addControl("time", this.cTime);
        form.addControl("players", this.cPlayers);
        break;

      case "search":
        form.addControl("", this.cTerm);
        break;
    }

    //  Listen to Changes for Date Time Merge
    form.valueChanges.pipe(this.sessionService.serverPipe).subscribe((v) => {
      //  console.log ("form.valueChanges.v: ", v);

      if (v['time'] != "" && v['date'] instanceof Date && v['date'].getHours() == 0) {
        var d = new Date(v['date'].toDateString() + " " + v['time']);
        console.log("date set: ", d);
        this.setDate(d);
      }
    });


    this.form.next(form);
  }

  /**
  *  @returns boolean
  *  Form needs to be Valid, Touched, and not Disabled.
  */
  ReadyForSubmission(): boolean {
    if (this.form.value.valid && this.form.value.dirty && !this.form.value.disabled) {
      return true;
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
    this.form.value.get("format").setValue(values.cFormat);
    this.form.value.get("course").setValue(values.cCourse);
    this.form.value.get("date").setValue(values.cDate);
    this.form.value.get("time").setValue(values.cTime);
    this.form.value.get("scores").setValue(values.cScores);
    this.form.value.markAsDirty();

  }

  setFormat(format) {
    this.form.value.get("format").setValue(format);
    //  If Format Changes to/from FFA; Update Controls(Team)

    if (format.enum == "ffa" && this.form.value.get('teams')) {
      this.form.value.removeControl("teams");
      this.form.value.removeControl("roster");
    } else if (format.enum != "ffa" && !this.form.value.get('teams')){
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
    if (this.teamList.controls.length < 8) {
      var id = Math.floor(Math.random() * 100);
      this.teamList.push(new FormControl({
        id: id,
        name: "Team " + id,
        color: this.teamColorList[this.teamList.controls.length]
      }));

      //  Disable Color
      this.teamColorList[this.teamList.controls.length].available = false;

    } else {
      // Too Many
    }
    
  }

  removeTeam(team) {
    this.teamList.controls.forEach((v, i) => {
      if (team.id == v.value.id) {
        this.teamList.removeAt(i);
      }
    });
  }

  getTeamColor() {

  }



  submitCreation() {
    console.log("SubmitCreation.form: ", this.form);

    //  Append Date + Time;
    var score: Score[]
    this.scoreList.controls.forEach((v, i) => {
      var s = new Score();
      /*
      s.player = v.player;
      s.team = v.team;
      s.handicap = v.handicap;
      */
      score.push(s);
    });
    


    var session = new Session();
    session.format = this.form.value.value.cFormat;
    session.course = this.form.value.value.cCourse;
    session.starts_on = this.form.value.value.cDate;
    session.scores = score;

    this.sessionService.create(session).subscribe((res) => {
      console.log ("sessionsService.create.res: ", res)
    });



    //  Old

    /*
        if (this.form.valid && this.form.dirty) {


      //  Convert Date
      var d: Date = new Date(this.form.get('start').value);
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();

      var hour = this.form.get('hour').value;
      var min = this.form.get('min').value;
      var convert = this.form.get('ampm').value.toLowerCase()

      //  AM/PM Fix
      if (convert == 'pm' && hour != '12') {
        hour = (+hour + 12);
      } else if (convert == 'am' && hour == '12') {
        hour = "00";
      }

      //  Set Start Date
      var d = new Date(year, month, day, hour, min);

      //  Create Session
      var session: Session = new Session(
        null,
        this.form.get('course').value,
        "ffa",
        d,
        this.form.get('description').value
      );

      //  Send Request
      this.sessions.createSession(session).subscribe((res: ServerPayload) => {
        this.feed.finializeLoading(res, true);
        if (res['status'] == 'success') { }

      });
    }
  */
  }

















}


import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SessionFormService } from '../../services/form.service';
import { AccountFormService } from 'src/app/modules/account/services/account-form.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { flyInPanelRow } from 'src/app/animations';
import { FeedbackService } from 'src/app/modules/feedback/services/feedback.service';
import { ActivatedRoute } from '@angular/router';
import { SessionBackend, Session } from '../../services/backend.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [flyInPanelRow]
})
export class CreateComponent implements OnInit {

  form: FormGroup;
  roster = [];

  session: Session = new Session();
  mode: string = "view";

  constructor(
    private route: ActivatedRoute,
    private sessionForm: SessionFormService,
    private sessionBackend: SessionBackend,
    private accountForm: AccountFormService,
    private accountBackend: AccountBackend,
    private feed: FeedbackService,
  ) { }

  ngOnInit() {


    //  Consolidate Create/Edit/Detail pages into one. Similar page layout for each
    // Get Page Type: Edit/View/Create
    if (this.route.snapshot.paramMap.get('session') == "create") {
      this.mode = "create";
      //  Setup Form
      this.sessionForm.Setup("create");
      this.sessionForm.form$.subscribe((f) => {
        this.form = f;
      });
    } else {
      this.sessionForm.Setup("edit");
      this.sessionForm.form$.subscribe((f) => {
        this.form = f;
      });


      //  this.session.id = this.route.snapshot.paramMap.get('session');
      //  this.sessionBackend.setSessionFromID(this.session.id);
      /*
      this.sessionBackend.detail$.subscribe((s) => {
        console.log("foundSession: ", s);
        this.session = s;
        if (this.session.created_by == this.accountBackend.user.id) {
          this.mode = "edit";

          this.sessionForm.setForm(s);

        } else {
          this.mode = "view";
        }
      });
      */

      console.log (this.route.data);
      this.route.data.subscribe((d)=>{
        console.log ("resolver.route.data: ", d);
      });

     
      
    }
    console.log("session.mode: ", this.mode);



  }

  selectFormat($event) {
    this.sessionForm.setFormat($event);
  }

  selectCourse($event) {
    this.sessionForm.setCourse($event);

  }




  get scoreList() {
    return this.form.get("scores") as FormArray;
  }

  addScore($event) {
    this.sessionForm.addScore($event);
  }

  removeScore($event) {
    this.sessionForm.removeScore($event);
  }

  trackScores(input, item) {
    return item.value.id;
  }





  get teamList() {
    return this.form.get("teams") as FormArray;
  }

  addTeam() {
    this.sessionForm.addTeam();
    if (this.scoreList.controls.length > 0 && this.roster.length == 0) {
      this.roster[0] = this.scoreList.value;
    } else if (this.roster.length < this.teamList.length) {
      this.roster.push([]);
    }
  }

  removeTeam(team) {
    this.sessionForm.removeTeam(team);
  }

  trackTeamBy(index, item) {
    item.value.id;
  }





  getRoster(team) {
    var roster;
    if (team == null) {
      roster = this.scoreList.value.filter((s) => { return !s.team });
    } else {
      roster = this.scoreList.value.filter((s) => {
        if (s.team) {
          return s.team == team.value;
        }

      })
    }
    return roster;
  }

  rosterDrop(event: CdkDragDrop<string[]>) {

    //  Get Destination Color Name
    var teamDestName = event.container.id.toString().replace("team-", "");

    //  Get Team Object From Color Name
    var teamDest = this.teamList.value.filter((t) => {
      return t.color.name == teamDestName;
    });

    //  Update Player's Team
    this.scoreList.controls.forEach((s) => {
      if (event.item.data.player.id == s.value.player.id) {
        s.value.team = teamDest[0];
      }
    });
  }

}

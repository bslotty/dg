
import { Component, OnInit } from '@angular/core';
import { flyIn } from 'src/app/animations';
import { FormGroup } from '@angular/forms';
import { SessionFormService } from '../../services/form.service';
import { SessionBackend, Session } from '../../services/backend.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ScoresBackend } from 'src/app/modules/scores/services/backend.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [flyIn]
})
export class DetailComponent implements OnInit {

  session: Session = new Session();
  form: FormGroup;

  playerModes = ["full", "admin"];
  
  constructor(
    private _sessionsForm: SessionFormService,
    private _sessions: SessionBackend,
    private _scores: ScoresBackend,
    private router: ActivatedRoute,
  ) { }

  ngOnInit() {
    
    //  Setup Form
    this._sessionsForm.Setup("edit");
    this._sessionsForm.form$.subscribe((f)=>{
      this.form = f;
    });

    //  Populate Data for form
    this.session.id = this.router.snapshot.paramMap.get("session");
    this._sessions.getDetail(this.session);
    
  }

  scoreAction($event) {
    console.log("$event: ", $event);
  }
}

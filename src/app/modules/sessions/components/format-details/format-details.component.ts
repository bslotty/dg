import { Component, OnInit, Input } from '@angular/core';
import { SessionBackend } from 'src/app/modules/sessions/services/backend.service';

@Component({
  selector: 'app-session-format',
  templateUrl: './format-details.component.html',
  styleUrls: ['./format-details.component.css']
})
export class FormatDetailsComponent implements OnInit {

  @Input() format: string;

  selected;
  hasAccess:boolean = false;
  resetDisclaimer: boolean = false;
  resolve: boolean = false;

  constructor(
    public sessions: SessionBackend,
  ) { }

  ngOnInit() { }



  disclaimerCheck(type) {
    if (type.indexOf("team") > -1 && this.selected == "ffa") {
      //  User is changing from FFA to Team; Show Disclaimer 
    }
  }

  setFormat(type) {
    console.log ("current: ", this.selected);
    console.log ("type: ", type);

    this.sessions.updateFormat(type.enum);


  }
}
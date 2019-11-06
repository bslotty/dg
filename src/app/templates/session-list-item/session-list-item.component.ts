import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { League } from 'src/app/modules/leagues/services/backend.service';

@Component({
  selector: 'app-session-list-item',
  templateUrl: './session-list-item.component.html',
  styleUrls: ['./session-list-item.component.scss']
})
export class SessionListItemComponent implements OnInit {


  @Input() session;
  league = new League(this.router.snapshot.paramMap.get("league"));

  constructor(
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
  }

}

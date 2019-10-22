import { League } from './../../../leagues/services/backend.service';
import { SessionBackend, Session } from './../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { flyInPanelRow, flyIn } from 'src/app/animations';
import { MatDialog } from '@angular/material';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-session-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [flyInPanelRow, flyIn],
})
export class ListComponent implements OnInit {

  createSessionMessage: boolean = false;
  emptySessions: boolean = false;
  
  @Input() title: string;
  @Input() sessionList: Session[] = [];
  @Input() limit: boolean = true;
  @Input() from: number = 0;

  constructor( ) { }

  ngOnInit() { }


  itemTrackBy(index: number, item) {
    return item.id;
  }
}

import { SessionBackend, Session } from './../../services/backend.service';
import { Component, OnInit, Input } from '@angular/core';
import { flyInPanelRow } from 'src/app/animations';

@Component({
  selector: 'session-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [flyInPanelRow],
})
export class ListComponent implements OnInit {

  @Input() list: Session[] = [];
  @Input() disabled: boolean = false;

  constructor( ) { }

  ngOnInit() { }


  itemTrackBy(index: number, item) {
    return item.id;
  }
}

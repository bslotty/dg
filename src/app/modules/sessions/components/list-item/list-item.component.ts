import { Component, OnInit, Input } from '@angular/core';
import { Session } from 'src/app/shared/types';

@Component({
  selector: 'session-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

  @Input() session: Session;

  constructor() { }

  ngOnInit() {
    
  }

}

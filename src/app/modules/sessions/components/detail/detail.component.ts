
import { Component, OnInit } from '@angular/core';
import { flyIn } from 'src/app/animations';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  animations: [flyIn]
})
export class DetailComponent implements OnInit {

  constructor() { }

  ngOnInit() {;
  }
}

import { Component, OnInit } from '@angular/core';
import { flyIn } from 'src/app/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [flyIn],
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

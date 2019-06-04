import { Component, OnInit } from '@angular/core';
import { fade } from 'src/app/animations';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
  animations: [fade],
})
export class ShellComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

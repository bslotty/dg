import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../services/backend.service';
import { MarkerManager } from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() course;
  zoom: number = 4;

  constructor() { 
    if (!this.course) {
      this.course = {};
      this.course["lat"] = 40;
      this.course["lng"] = -85;
    }

  }

  ngOnInit() {
  }

  pin(event){
    console.log ("Map Click: ", event);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.css']
})
export class SectionHeaderComponent implements OnInit {



  @Input() title: string;
  @Input() buttons: Array<HeaderButton>;
  @Input() back: string;

  @Output() actionClick = new EventEmitter<string>();

  justification: string;

  constructor() { }

  ngOnInit() {
    if (this.buttons && this.buttons.length > 0) {
      this.justification = "left";
    } else {
      this.justification = "center";
    }
  }

  emit(action) {

    /*  Router?
      <a mat-flat-button color="transparent-primary" routerLink="/leagues/{{ league?.id }}">
        <span class="icon-pocket rotate-90"></span>
      </a>
    */
    this.actionClick.emit(action);
  }

}

export interface HeaderButton {
  icon: string;
  action: string;
  color: string;
}
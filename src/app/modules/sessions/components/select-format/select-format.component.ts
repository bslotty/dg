import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionBackend } from '../../services/backend.service';

@Component({
  selector: 'app-select-format',
  templateUrl: './select-format.component.html',
  styleUrls: ['./select-format.component.scss']
})
export class SelectFormatComponent implements OnInit {

  @Input() selectedFormat;
  @Output() selected:EventEmitter<any> = new EventEmitter();

  constructor(
    private sessions: SessionBackend,
  ) { }

  ngOnInit() { }

  setFormat(type) {
    console.log ("type: ", type);
    this.selected.emit(type);
  }
}
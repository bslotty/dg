import { Component, OnInit, Input } from '@angular/core';
import { flyIn } from 'src/app/animations';
import { SessionFormService } from '../../services/form.service';
import { SessionFormat, SessionBackend } from '../../services/backend.service';

@Component({
  selector: 'app-select-format',
  templateUrl: './select-format.component.html',
  styleUrls: ['./select-format.component.scss'],
  animations: [flyIn],
})
export class SelectFormatComponent implements OnInit {

  @Input() selectedFormat: SessionFormat;

  constructor(
    private sessions_: SessionBackend,
    private sessionsF: SessionFormService
  ) { }

  ngOnInit() {}

  setFormat(type) {
    this.sessionsF.setFormat(type);
  }
}
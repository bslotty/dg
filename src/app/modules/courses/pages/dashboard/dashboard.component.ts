import { Component, OnInit } from '@angular/core';
import { CourseBackend } from '../../services/backend.service';
import { FeedbackService } from 'src/app/shared/modules/feedback/services/feedback.service';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
import { Observable } from 'rxjs';
import { flyIn } from 'src/app/animations';
import { CourseFormService } from '../../services/course-form.service';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [flyIn]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}

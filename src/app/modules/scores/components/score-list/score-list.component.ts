import { Component, OnInit, Input } from '@angular/core';
import { ScoresBackend, Score } from '../../services/backend.service';
import { Observable } from 'rxjs';
import { SessionBackend } from 'src/app/modules/sessions/services/backend.service';

@Component({
  selector: 'score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.scss']
})
export class ScoreListComponent implements OnInit {

  private scores$: Observable<Score[]> = this.scores_.scores$;
  
  constructor(
    private scores_:ScoresBackend,
  ) { }

  ngOnInit() { }
}

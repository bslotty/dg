import { Component, OnInit, Input } from '@angular/core';
import { ScoresBackend } from '../../services/backend.service';
import { Observable } from 'rxjs';
import { Score, listCategories } from 'src/app/shared/types';

@Component({
  selector: 'score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.scss']
})
export class ScoreListComponent implements OnInit {

  private scores$: Observable<Score[]> = this.scores_.scores$;
  
  list: Array<listCategories>;

  constructor(
    private scores_:ScoresBackend,
  ) { }

  ngOnInit() { }
}

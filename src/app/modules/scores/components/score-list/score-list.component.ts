import { Component, OnInit, Input } from '@angular/core';
import { ScoresBackend, Score } from '../../services/backend.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.scss']
})
export class ScoreListComponent implements OnInit {

  private scores$: Observable<Score[]> = this.scores_.scores$;

  private modes: string[] = ["full", "remove"];

  @Input() backdrop: boolean = false;
  
  constructor(
    private scores_:ScoresBackend,
  ) { }

  ngOnInit() {
  }

}

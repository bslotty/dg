import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerScoreListComponent } from './player-score-list.component';

describe('PlayerScoreListComponent', () => {
  let component: PlayerScoreListComponent;
  let fixture: ComponentFixture<PlayerScoreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerScoreListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerScoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

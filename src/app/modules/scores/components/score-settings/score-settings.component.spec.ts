import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreSettingsComponent } from './score-settings.component';

describe('ScoreSettingsComponent', () => {
  let component: ScoreSettingsComponent;
  let fixture: ComponentFixture<ScoreSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

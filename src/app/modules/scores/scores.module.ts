import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

import { ScoreListItemComponent } from './components/templates/score-list-item/score-list-item.component';
import { TeamListItemComponent } from './components/templates/team-list-item/team-list-item.component';
import { ScoreSettingsComponent } from './components/score-settings/score-settings.component';
import { TeamSettingsComponent } from './components/team-settings/team-settings.component';




@NgModule({
  declarations: [
    ScoreListItemComponent,
    TeamListItemComponent,
    ScoreSettingsComponent,
    TeamSettingsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    ScoreListItemComponent,
    TeamListItemComponent,
    ScoreSettingsComponent,
    TeamSettingsComponent,
  ],
  entryComponents: [
    ScoreSettingsComponent,
    TeamSettingsComponent,
  ],
  providers: [

  ]
})
export class ScoresModule { }

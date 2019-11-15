import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/modules/material/material.module';


import { ScoreSettingsComponent } from './components/score-settings/score-settings.component';
import { TeamSettingsComponent } from './components/team-settings/team-settings.component';
import { ScoreListItemComponent } from './components/score-list-item/score-list-item.component';
import { TeamListItemComponent } from './components/team-list-item/team-list-item.component';




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

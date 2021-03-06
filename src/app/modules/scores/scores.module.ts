import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/modules/material/material.module';


import { ScoreSettingsComponent } from './dialogs/score-settings/score-settings.component';
import { TeamSettingsComponent } from './dialogs/team-settings/team-settings.component';
import { ScoreListItemComponent } from './components/score-list-item/score-list-item.component';
import { TeamListItemComponent } from './components/team-list-item/team-list-item.component';
import { TeamSelectComponent } from './components/team-select/team-select.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { ScoreListComponent } from './components/score-list/score-list.component';




@NgModule({
  declarations: [
    ScoreListItemComponent,
    TeamListItemComponent,
    ScoreSettingsComponent,
    TeamSettingsComponent,
    TeamSelectComponent,

    TeamListComponent,
    ScoreListComponent,
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

    TeamSelectComponent,

    TeamListComponent,
    ScoreListComponent,
  ],
  entryComponents: [
    ScoreSettingsComponent,
    TeamSettingsComponent,
  ],
  providers: [
  ]
})
export class ScoresModule { }

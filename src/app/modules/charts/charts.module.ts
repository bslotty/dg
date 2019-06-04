import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineComponent } from 'src/app/modules/charts/line/line.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { MaterialModule } from '../material/material.module';
import { LineSettingsComponent } from './line-settings/line-settings.component';

@NgModule({
  imports: [
    CommonModule,
    GoogleChartsModule,
    MaterialModule,
  ],
  declarations: [
    LineComponent,
    ScoreboardComponent,
    LineSettingsComponent,
    
    
  ],
  exports: [
    LineComponent,
  ],
  entryComponents: [LineSettingsComponent]
})
export class ChartsModule { }

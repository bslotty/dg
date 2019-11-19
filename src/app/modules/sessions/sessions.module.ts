import { PipesModule } from '../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesModule } from '../courses/courses.module'
import { ScoresModule } from '../scores/scores.module';
// MFD
import { StatsModule } from '../stats/stats.module';


import { SessionsRoutingModule } from './sessions-routing.module';

import { DetailComponent } from './components/detail/detail.component';
import { CreateComponent } from './components/create/create.component';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ShellComponent } from './components/shell/shell.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { SelectFormatComponent } from './components/select-format/select-format.component';
import { SelectPlayersComponent } from './components/select-players/select-players.component';
import { ListItemComponent as SessionListItemComponent } from './components/list-item/list-item.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    StatsModule,
    ScoresModule,
    CoursesModule,
    SessionsRoutingModule,
    PipesModule,
  ],
  declarations: [    
    DetailComponent, 
    CreateComponent, 
    ShellComponent, 
    DashboardComponent, 
    SelectPlayersComponent,
    SelectFormatComponent,
    SessionListItemComponent, 
  ],
  exports: [],
  entryComponents: [
    SelectPlayersComponent,
    SelectFormatComponent, 
  ]
})
export class SessionsModule { }

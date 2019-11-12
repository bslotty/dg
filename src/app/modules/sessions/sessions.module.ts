import { PipesModule } from '../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesModule } from '../courses/courses.module'
import { ScoresModule } from '../scores/scores.module';
// MFD
import { StatsModule } from '../stats/stats.module';


import { SessionsRoutingModule } from './sessions-routing.module';

import { ListComponent as SessionList } from './components/list/list.component';

import { DetailComponent } from './components/detail/detail.component';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ShellComponent } from './components/shell/shell.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { SelectFormatComponent } from './components/select-format/select-format.component';
import { SelectCourseComponent } from './components/select-course/select-course.component';
import { SelectPlayersComponent } from './components/select-players/select-players.component';


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
    SessionList, 
    DetailComponent, 
    CreateComponent, 
    EditComponent, 
    ShellComponent, 
    DashboardComponent, 
    SelectCourseComponent, 
    SelectPlayersComponent,
    SelectFormatComponent, 
  ],
  exports: [
    SessionList
  ],
  entryComponents: [
    SelectCourseComponent, 
    SelectPlayersComponent,
    SelectFormatComponent, 
  ]
})
export class SessionsModule { }

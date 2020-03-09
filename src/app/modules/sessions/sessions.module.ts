import { PipesModule } from '../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesModule } from '../courses/courses.module'
import { ScoresModule } from '../scores/scores.module';
// MFD


import { SessionsRoutingModule } from './sessions-routing.module';

import { DetailComponent } from './pages/detail/detail.component';
import { CreateComponent } from './pages/create/create.component';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ShellComponent } from './pages/shell/shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { SelectFormatComponent } from './dialogs/select-format/select-format.component';
import { SelectPlayersComponent } from './dialogs/select-players/select-players.component';
import { ListItemComponent as SessionListItemComponent } from './components/list-item/list-item.component';
import { SelectTimeComponent } from './dialogs/select-time/select-time.component';
import { SelectCourseComponent } from './dialogs/select-course/select-course.component';
import { PlayComponent } from './pages/play/play.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
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
    SelectTimeComponent,
    SelectCourseComponent,
    PlayComponent,
  ],
  exports: [],
  entryComponents: [
    SelectPlayersComponent,
    SelectFormatComponent, 
    SelectTimeComponent,
    SelectCourseComponent,
  ]
})
export class SessionsModule { }

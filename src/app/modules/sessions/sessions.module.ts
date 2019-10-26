import { PipesModule } from '../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatsModule } from 'src/app/modules/stats/stats.module';

import { SessionsRoutingModule } from './sessions-routing.module';

import { ListComponent as SessionList } from './components/list/list.component';

import { DetailComponent } from './components/detail/detail.component';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';
import { MaterialModule } from '../material/material.module';
import { ShellComponent } from './components/shell/shell.component';
import { FormatDetailsComponent } from './components/format-details/format-details.component';
import { SessionListItemComponent } from '../../templates/session-list-item/session-list-item.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseSelectorComponent } from './components/course-selector/course-selector.component';
import { PlayerSelectorComponent } from './components/player-selector/player-selector.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    StatsModule,
    SessionsRoutingModule,
    PipesModule,
    NgbModule,
  ],
  declarations: [    
    SessionList, 
    DetailComponent, 
    CreateComponent, 
    EditComponent, 
    ShellComponent, FormatDetailsComponent, SessionListItemComponent, DashboardComponent, CourseSelectorComponent, PlayerSelectorComponent
  ],
  exports: [
    SessionList
  ],
  entryComponents: [
    FormatDetailsComponent,
    CreateComponent,
  ]
})
export class SessionsModule { }

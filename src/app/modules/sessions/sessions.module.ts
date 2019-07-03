import { PipesModule } from './../pipes/pipes/pipes.module';
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



@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    StatsModule,
    SessionsRoutingModule,
    PipesModule,
  ],
  declarations: [    
    SessionList, 
    DetailComponent, 
    CreateComponent, 
    EditComponent, 
    ShellComponent, FormatDetailsComponent
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


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/modules/pipes/pipes/pipes.module';

import { LeaguesRoutingModule } from './leagues-routing.module';
import { LeagueBackend } from './services/backend.service';
import { MaterialModule } from './../material/material.module';

import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './components/detail/detail.component';
import { SearchComponent } from './components/search/search.component';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';
import { ShellComponent } from './components/shell/shell.component';

/*  Child Components  */
import { SessionsModule } from '../sessions/sessions.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { DeleteComponent } from './components/delete/delete.component';
import { FeedbackComponent } from '../feedback/components/feedback/feedback.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SessionsModule,
    PermissionsModule,
    LeaguesRoutingModule,
    PipesModule,
  ],
  declarations: [
    ListComponent, 
    DetailComponent, 
    SearchComponent, 
    CreateComponent, 
    EditComponent, 
    ShellComponent, DeleteComponent
  ],
  providers: [LeagueBackend],
  entryComponents: [
    DeleteComponent,
  ]
})
export class LeaguesModule { }

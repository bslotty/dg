import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/modules/material/material.module';
import { ShellComponent } from './components/shell/shell.component';
import { PipesModule } from '../pipes/pipes/pipes.module';
import { ChartsModule } from 'src/app/modules/charts/charts.module';

import { CreateTeamComponent } from './components/create-team/create-team.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { EditTeamComponent } from './components/edit-team/edit-team.component';
import { DeleteTeamComponent } from './components/delete-team/delete-team.component';

import { CreatePlayerComponent } from './components/create-player/create-player.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { EditPlayerComponent } from './components/edit-player/edit-player.component';
import { DeletePlayerComponent } from './components/delete-player/delete-player.component';

import { MergeTempUsersComponent } from './components/merge-temp-users/merge-temp-users.component';
import { CreateTempUsersComponent } from './components/create-temp-users/create-temp-users.component';
import { PlayerScoreListComponent } from './components/player-score-list/player-score-list.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    PipesModule,
    ChartsModule,
  ],
  declarations: [
    CreatePlayerComponent,
    EditPlayerComponent,
    ShellComponent,
    MergeTempUsersComponent,
    CreateTempUsersComponent,
    CreateTempUsersComponent,
    CreateTeamComponent,
    TeamListComponent,
    EditTeamComponent,
    DeleteTeamComponent,
    DeletePlayerComponent,
    CreatePlayerComponent,
    PlayerListComponent,
    PlayerScoreListComponent
  ], exports: [
    TeamListComponent,
    PlayerListComponent,
  ],
  entryComponents: [
    CreateTempUsersComponent, 
    MergeTempUsersComponent,
    CreateTeamComponent,
    EditTeamComponent,
    DeleteTeamComponent,
    DeletePlayerComponent,
    CreatePlayerComponent,
    EditPlayerComponent,
  ]
})
export class StatsModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './components/detail/detail.component';
import { EditComponent } from './components/edit/edit.component';
import { CreateComponent } from './components/create/create.component';

import { ShellComponent } from './components/shell/shell.component';
import { PermGuard } from '../../guards/perm.service';
import { LeagueGuard } from 'src/app/guards/league.service';

import { PlayerScoreListComponent } from '../stats/components/player-score-list/player-score-list.component';

const sessionRoutes: Routes = [
  {
    path: 'leagues/:league/sessions',
    component: ShellComponent,
    canActivate: [LeagueGuard],
  },{
    path: "leagues/:league/sessions/create",
    component: CreateComponent,
    canActivate: [PermGuard],
  },{
    path: "leagues/:league/sessions/:session/edit",
    component: EditComponent,
    canActivate: [LeagueGuard, PermGuard],
  },{
    path: "leagues/:league/sessions/:session/play",
    component: PlayerScoreListComponent,
    canActivate: [LeagueGuard],
  },{
    path: "leagues/:league/sessions/:session",
    component: DetailComponent,
    canActivate: [LeagueGuard],
  },];

@NgModule({
  imports: [RouterModule.forChild(sessionRoutes)],
  exports: [RouterModule]
})
export class SessionsRoutingModule { }


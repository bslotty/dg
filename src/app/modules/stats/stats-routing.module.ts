import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellComponent } from './components/shell/shell.component';


import { DetailComponent as SessionDetailComponent } from '../sessions/pages/detail/detail.component';
import { PermGuard } from 'src/app/guards/perm.service';
import { LeagueGuard } from 'src/app/guards/league.service';
import { MergeTempUsersComponent } from './components/merge-temp-users/merge-temp-users.component';
import { PlayerScoreListComponent } from './components/player-score-list/player-score-list.component';

const statsRoutes: Routes = [{
  path: 'leagues/:league/sessions/:session',
  component: ShellComponent,
  canActivate: [LeagueGuard],
  children: 
  [{
    path: "",
    component: SessionDetailComponent,
  },{
    path: "play",
    component: PlayerScoreListComponent,
  },{
    path: "merge",
    component: MergeTempUsersComponent,
    canActivate: [PermGuard],
  }]
}];


@NgModule({
  imports: [RouterModule.forChild(statsRoutes)],
  exports: [RouterModule]
})
export class StatsRoutingModule { }

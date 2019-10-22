import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './components/detail/detail.component';
import { EditComponent } from './components/edit/edit.component';
import { CreateComponent } from './components/create/create.component';

import { ShellComponent } from './components/shell/shell.component';


import { PlayerScoreListComponent } from '../stats/components/player-score-list/player-score-list.component';


import { AuthGuard } from 'src/app/guards/auth.service';
import { PermGuard } from '../../guards/perm.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const sessionRoutes: Routes = [
  {
    path: 'sessions',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "create",
        component: CreateComponent,
        canActivate: [PermGuard],
      }, {
        path: ":session/edit",
        component: EditComponent,
        canActivate: [PermGuard],
      }, {
        path: ":session/play",
        component: PlayerScoreListComponent,
        canActivate: [PermGuard],
      }, {
        path: ":session",
        component: DetailComponent,
        canActivate: [PermGuard],
      },{
        path: "",
        component: DashboardComponent,
        canActivate: [PermGuard],

      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(sessionRoutes)],
  exports: [RouterModule]
})
export class SessionsRoutingModule { }


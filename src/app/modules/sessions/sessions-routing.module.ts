import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './components/create/create.component';

import { ShellComponent } from './components/shell/shell.component';


import { PlayerScoreListComponent } from '../stats/components/player-score-list/player-score-list.component';


import { AuthGuard } from 'src/app/guards/auth.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SessionAdminGuard } from 'src/app/guards/session-admin.guard';

import { SessionResolverService } from './services/resolver.service';

const sessionRoutes: Routes = [
  {
    path: 'sessions',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "create",
        component: CreateComponent,
        canActivate: [],
      }, {
        path: ":session",
        component: CreateComponent,
        //component: EditComponent,
        canActivate: [SessionAdminGuard],
        resolve: {
          session: SessionResolverService
        }
      },  {
        path: ":session",
        component: CreateComponent,
        //  component: DetailComponent,
        canActivate: [!SessionAdminGuard],
      },{
        path: ":session/play",
        component: PlayerScoreListComponent,
        canActivate: [],
      },{
        path: "",
        component: DashboardComponent,
        canActivate: [],

      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(sessionRoutes)],
  exports: [RouterModule]
})
export class SessionsRoutingModule { }


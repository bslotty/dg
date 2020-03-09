import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './pages/create/create.component';

import { ShellComponent } from './pages/shell/shell.component';



import { AuthGuard } from 'src/app/guards/auth.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DetailComponent } from './pages/detail/detail.component';
import { PlayComponent } from './pages/play/play.component';


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
      },{
        path: ":session",
        component: DetailComponent,
        canActivate: [],
      },{
        path: ":session/play",
        component: PlayComponent,
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


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*  Components  */
import { ShellComponent } from './components/shell/shell.component';
import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './components/detail/detail.component';
import { SearchComponent } from './components/search/search.component';
import { EditComponent } from './components/edit/edit.component';
import { CreateComponent } from './components/create/create.component';

/*  Guards  */
import { AuthGuard } from '../../guards/auth.service';
import { PermGuard } from '../../guards/perm.service';
import { LeagueGuard } from '../../guards/league.service';


const leagueRoutes: Routes = [{
    path: "leagues/search",
    component: SearchComponent,
    canActivate: [AuthGuard],
  },{
    path: 'leagues/list',
    component: ListComponent,
    canActivate: [AuthGuard],
  },{
    path: 'leagues/create',
    component: CreateComponent,
    canActivate: [AuthGuard, LeagueGuard],
  },{
    path: 'leagues/:league/edit',
    component: EditComponent,
    canActivate: [AuthGuard, LeagueGuard, PermGuard],
  },{
    path: 'leagues/:league',
    component: DetailComponent,
    canActivate: [AuthGuard, LeagueGuard],
  },{
    path: 'leagues',
    redirectTo: "leagues/list",
    pathMatch: "full",
    canActivate: [AuthGuard],
  },];

@NgModule({
  imports: [RouterModule.forChild(leagueRoutes)],
  exports: [RouterModule]
})
export class LeaguesRoutingModule { }

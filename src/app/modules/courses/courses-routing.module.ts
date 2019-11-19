import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*  Components  */
import { ShellComponent } from './components/shell/shell.component';
import { DetailComponent } from './components/detail/detail.component';
import { SearchComponent } from './components/search/search.component';
import { CreateComponent } from './components/create/create.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AuthGuard } from 'src/app/guards/auth.service';




const courseRoutes: Routes = [{
  path: 'courses',
  component: ShellComponent,
  children: [
    {
      path: '',
      component: DashboardComponent,
    },{
      path: "search",
      component: SearchComponent,
    },{
      path: 'create',
      component: CreateComponent,
      canActivate: [AuthGuard],
    },{
      path: ':name',
      component: DetailComponent,
      data: []
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(courseRoutes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }

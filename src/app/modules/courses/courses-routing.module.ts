import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*  Components  */
import { ShellComponent } from './pages/shell/shell.component';
import { DetailComponent } from './pages/detail/detail.component';
import { SearchComponent } from './components/search/search.component';
import { CreateComponent } from './pages/create/create.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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

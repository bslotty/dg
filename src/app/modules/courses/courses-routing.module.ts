import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*  Components  */
import { ShellComponent } from './components/shell/shell.component';

import { ListComponent } from './components/list/list.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

import { DetailComponent } from './components/detail/detail.component';
import { SearchComponent } from './components/search/search.component';
import { CreateComponent } from './components/create/create.component';
import { NearbyComponent } from './components/nearby/nearby.component';


/*  Guards  */
import { AuthGuard } from 'src/app/guards/auth.service';



const courseRoutes: Routes = [{
  path: 'courses',
  component: ShellComponent,
  children: [
    {
      path: '',
      component: FavoritesComponent,
    },{
      path: "search",
      component: SearchComponent,
    },{
      path: 'create',
      component: CreateComponent,
      canActivate: [AuthGuard],
    },{
      path: 'nearby',
      component: NearbyComponent,
    },{
      path: ':id',
      component: DetailComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(courseRoutes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './404/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { LoadGuard } from './guards/load.service';

const appRoutes: Routes = [{ 
  path: '',
  redirectTo: 'home', 
  pathMatch: 'full',
  },{  
    path: 'home',
    component: HomeComponent,
  },{ 
    path: '**', 
    component: PageNotFoundComponent 
  }];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, /*{enableTracing: true}*/),
  ],
  exports: [RouterModule]
})
export class NavigationModule { }

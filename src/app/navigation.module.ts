import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './404/page-not-found.component';
import { HomeComponent } from './home/home.component';

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

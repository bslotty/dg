import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellComponent } from './components/shell/shell.component';
import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';
import { PermGuard } from '../../guards/perm.service';
import { AuthGuard } from 'src/app/guards/auth.service';

const permissionRoutes: Routes = [
{
  path: "leagues/:league/join",
  component: CreateComponent,
  canActivate: [AuthGuard],
},{
  path: "leagues/:league/requests",
  component: ListComponent,
  canActivate: [AuthGuard, PermGuard],
},{
  path: 'leagues/:league/users',
  component: ShellComponent,
  canActivate: [AuthGuard],
  children: 
  [{
    path: "",
    redirectTo: "list",
    pathMatch: 'full',
  },{
    path: "list",
    component: ListComponent,
    canActivate: [AuthGuard],
  },{
    path: ':user',
    component: EditComponent,
    canActivate: [AuthGuard, PermGuard],
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(permissionRoutes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule { }

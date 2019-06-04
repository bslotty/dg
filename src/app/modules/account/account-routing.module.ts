import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*  Guard */
import { AuthGuard } from 'src/app/guards/auth.service';

/*  Components  */
import { ShellComponent } from './components/shell/shell.component';
import { DetailComponent } from './components/detail/detail.component';
import { EditComponent } from './components/edit/edit.component';

import { LoginComponent } from './components/login/login.component';
import { CreateComponent } from './components/create/create.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResetComponent } from './components/reset/reset.component';

const accountRoutes: Routes = [
{
  path: "account/register",
  component: CreateComponent,
},{
  path: 'account/login',
  component: LoginComponent,
},{
  path: "account/verify/:token",
  component: VerifyComponent,
},{
  path: "account/forgot",
  component: ForgotComponent,
},{
  path: "account/forgot/:token",
  component: SetPasswordComponent,
},{
  path: 'account',
  component: ShellComponent,
  canActivate: [AuthGuard],
  children: [
    { 
      path: '',
      redirectTo: 'detail', 
      pathMatch: 'full',
    },{
      path: 'detail',
      component: DetailComponent,
    },{
      path: "update",
      component: EditComponent,
    },{
      path: "reset",
      component: ResetComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(accountRoutes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }

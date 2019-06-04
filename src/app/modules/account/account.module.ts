import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*  Routing */
import { AccountRoutingModule } from './account-routing.module';

/*  Services  */
import { AccountBackend } from 'src/app/modules/account/services/backend.service';

/*  Views */
import { DetailComponent } from './components/detail/detail.component';
import { LoginComponent } from './components/login/login.component';
import { EditComponent } from './components/edit/edit.component';
import { ResetComponent } from './components/reset/reset.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { CreateComponent } from './components/create/create.component';
import { ShellComponent } from './components/shell/shell.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';

import { MaterialModule } from 'src/app/modules/material/material.module';


@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
  ],
  declarations: [
    DetailComponent, 
    LoginComponent, 
    EditComponent, 
    ResetComponent, 
    VerifyComponent, 
    ForgotComponent, 
    CreateComponent,
    ShellComponent,
    SetPasswordComponent,
  ],
  providers: [AccountBackend]
})
export class AccountModule { }

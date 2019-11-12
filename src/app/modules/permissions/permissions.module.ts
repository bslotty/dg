import { MaterialModule } from '../../shared/modules/material/material.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionBackend } from './services/backend.service';

import { ListComponent as PermissionList } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { ShellComponent } from './components/shell/shell.component';
import { CreateComponent } from './components/create/create.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { PendingComponent } from './components/pending/pending.component';
import { RemoveComponent } from './components/remove/remove.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PermissionsRoutingModule,
    PipesModule 
  ],
  declarations: [
    PermissionList,
    EditComponent,
    ShellComponent,
    CreateComponent,
    PendingComponent,
    RemoveComponent
  ], 
  exports: [
    PermissionList,
    EditComponent
  ],
  providers: [PermissionBackend],
  entryComponents: [
    PendingComponent,
    EditComponent,
    RemoveComponent
  ]
})
export class PermissionsModule { }

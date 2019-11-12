import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { AgmCoreModule } from '@agm/core';

import { ListComponent } from './components/templates/list/list.component';
import { SearchComponent } from './components/search/search.component';
import { DetailComponent } from './components/detail/detail.component';
import { MapComponent } from './components/map/map.component';
import { ShellComponent } from './components/shell/shell.component';


import { CreateComponent } from './components/create/create.component';
import { CourseBackend } from './services/backend.service';
import { CourseFormService } from './services/course-form.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { CourseListItemComponent } from './components/templates/course-list-item/course-list-item.component';



@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CoursesRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCT5Sv2Ldj4dz9k3la2bjTWHJDtg9z1Vuo',
      libraries: ['places']
    }),
  ],
  declarations: [
    ListComponent,
    SearchComponent,
    DetailComponent,
    MapComponent,
    ShellComponent,
    CreateComponent,
    DashboardComponent,
    CourseListItemComponent
  ],
  providers: [
    CourseBackend,
    CourseFormService
  ],
  exports: [
    SearchComponent,
    CourseListItemComponent
  ]

})
export class CoursesModule {

}

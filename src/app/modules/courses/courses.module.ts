import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { AgmCoreModule } from '@agm/core';


import { SearchComponent } from './components/search/search.component';
import { DetailComponent } from './pages/detail/detail.component';
import { MapComponent } from './components/map/map.component';
import { ShellComponent } from './pages/shell/shell.component';


import { CreateComponent } from './pages/create/create.component';
import { CourseBackend } from './services/backend.service';
import { CourseFormService } from './services/course-form.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { CourseListItemComponent } from './components/course-list-item/course-list-item.component';

import { ListComponent as CourseListComponent } from './components/list/list.component';



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
    CourseListComponent,
    SearchComponent,
    DetailComponent,
    MapComponent,
    ShellComponent,
    CreateComponent,
    DashboardComponent,
    CourseListItemComponent,
  ],
  providers: [
    CourseBackend,
    CourseFormService
  ],
  exports: [
    SearchComponent,
    CourseListComponent,
    CourseListItemComponent
  ]

})
export class CoursesModule {

}

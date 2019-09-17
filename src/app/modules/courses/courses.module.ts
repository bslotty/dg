import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { MaterialModule } from './../material/material.module';

import { ListComponent } from './components/list/list.component';
import { SearchComponent } from './components/search/search.component';
import { DetailComponent } from './components/detail/detail.component';
import { MapComponent } from './components/map/map.component';
import { ShellComponent } from './components/shell/shell.component';

import { AgmCoreModule } from '@agm/core';
import { CourseListComponent } from './components/templates/course-list/course-list.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CoursesRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCT5Sv2Ldj4dz9k3la2bjTWHJDtg9z1Vuo'
    }),
  ],
  declarations: [
    ListComponent, 
    SearchComponent, 
    DetailComponent, 
    MapComponent, 
    ShellComponent,
    CourseListComponent
  ]
})
export class CoursesModule { }

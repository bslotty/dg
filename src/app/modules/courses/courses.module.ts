import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { MaterialModule } from './../material/material.module';
import { AgmCoreModule } from '@agm/core';

import { ListComponent } from './components/list/list.component';
import { SearchComponent } from './components/search/search.component';
import { DetailComponent } from './components/detail/detail.component';
import { MapComponent } from './components/map/map.component';
import { ShellComponent } from './components/shell/shell.component';


import { CourseListItemComponent } from './components/templates/course-list-item/course-list-item.component';

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
    CourseListItemComponent
  ]
})
export class CoursesModule { }

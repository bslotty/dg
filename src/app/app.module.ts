import { PipesModule } from './modules/pipes/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

/*  Component Features  */
import { MaterialModule } from './modules/material/material.module';

/*  Sub-Module Imports  */
import { NavigationModule } from './navigation.module';
import { AccountModule } from 'src/app/modules/account/account.module';
import { CoursesModule } from 'src/app/modules/courses/courses.module';
import { LeaguesModule } from 'src/app/modules/leagues/leagues.module';
import { PageNotFoundComponent } from './404/page-not-found.component';
import { HomeComponent } from './home/home.component';

/*  Dependancies  */
import { HttpClientModule } from '@angular/common/http';
import { FeedbackComponent } from './modules/feedback/components/feedback/feedback.component';
import { ChartsModule } from 'src/app/modules/charts/charts.module';
import { GoogleChartsModule } from 'angular-google-charts';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
  ],
  imports: [
    /*  Dependancies  */
    HttpClientModule,
    RouterModule,
    MaterialModule.forRoot(),

    /*  Sub Modules / Routes  */
    CoursesModule,
    LeaguesModule,
    AccountModule,

    /*  Root Route  */
    NavigationModule,

    
    PipesModule,
    BrowserModule
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

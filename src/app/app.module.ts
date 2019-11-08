import { PipesModule } from './pipes/pipes.module';
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
import { SessionsModule } from './modules/sessions/sessions.module';
import { PageNotFoundComponent } from './404/page-not-found.component';
import { HomeComponent } from './home/home.component';

/*  Dependancies  */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './interceptor';



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
    SessionsModule,
    AccountModule,

    /*  Root Route  */
    NavigationModule,

    
    PipesModule,
    BrowserModule
  ],
  exports: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

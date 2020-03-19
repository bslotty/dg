import { PipesModule } from './pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

/*  Component Features  */
import { MaterialModule } from './shared/modules/material/material.module';

/*  Sub-Module Imports  */
import { NavigationModule } from './navigation.module';
import { AccountModule } from 'src/app/modules/account/account.module';
import { CoursesModule } from 'src/app/modules/courses/courses.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { PageNotFoundComponent } from './404/page-not-found.component';
import { HomeComponent } from './home/home.component';

/*  Dependancies  */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerInterceptor } from './interceptors/errorHandler.interceptor';
import { FormatterInterceptor } from './interceptors/formatter.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';




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
    BrowserAnimationsModule,
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
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ,
    { provide: HTTP_INTERCEPTORS, useClass: FormatterInterceptor, multi: true } ,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true } ,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


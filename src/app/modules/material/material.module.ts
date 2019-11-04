import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Angular Theme
import 'hammerjs';  //  Dependancy
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTableDataSource,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';


import { DragDropModule } from '@angular/cdk/drag-drop';

import { SectionHeaderComponent } from '../../templates/section-header/section-header.component';
import { LoaderComponent } from '../feedback/components/loader/loader.component';
import { FeedbackComponent } from '../feedback/components/feedback/feedback.component';
import { PasswordComponent } from 'src/app/templates/form-fields/password/password.component';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CourseListItemComponent } from 'src/app/templates/course-list-item/course-list-item.component';
import { TeamListItemComponent } from 'src/app/templates/team-list-item/team-list-item.component';
import { TeamSettingsComponent } from 'src/app/templates/team-settings/team-settings.component';
import { ScoreListItemComponent } from 'src/app/templates/score-list-item/score-list-item.component';
import { ScoreSettingsComponent } from 'src/app/templates/score-settings/score-settings.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,

    DragDropModule,
    NgxMaterialTimepickerModule,

  ],
  declarations: [
    FeedbackComponent,
    LoaderComponent,
    SectionHeaderComponent,
    PasswordComponent,
    CourseListItemComponent,
    ScoreListItemComponent,
    TeamListItemComponent,
    ScoreSettingsComponent,
    TeamSettingsComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,

    FeedbackComponent,
    LoaderComponent,
    SectionHeaderComponent,
    PasswordComponent,
    CourseListItemComponent,
    ScoreListItemComponent,
    TeamListItemComponent,
    ScoreSettingsComponent,
    TeamSettingsComponent,

    DragDropModule,
    NgxMaterialTimepickerModule
  ],
  entryComponents: [
    ScoreSettingsComponent,
    TeamSettingsComponent,
  ],
})
export class MaterialModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MaterialModule,
      providers: []
    };
  }

}

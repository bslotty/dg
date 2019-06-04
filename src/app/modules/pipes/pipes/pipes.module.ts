import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirstCharPipe } from './first-char.pipe';
import { StrokeTotalPipe } from './stroke-total.pipe';
import { UTCDatePipe } from './utcdate.pipe';
import { LeagueVisibilityIconPipe } from './league-visibility-icon.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StrokeTotalPipe,
    FirstCharPipe,
    UTCDatePipe,
    LeagueVisibilityIconPipe,
  ],
  exports: [
    StrokeTotalPipe,
    FirstCharPipe,
    UTCDatePipe,
    LeagueVisibilityIconPipe,
  ]
})
export class PipesModule { }

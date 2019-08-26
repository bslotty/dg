import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StrokeTotalPipe } from './stroke-total.pipe';
import { LeagueVisibilityIconPipe } from './league-visibility-icon.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StrokeTotalPipe,
    LeagueVisibilityIconPipe,
  ],
  exports: [
    StrokeTotalPipe,
    LeagueVisibilityIconPipe,
  ]
})
export class PipesModule { }

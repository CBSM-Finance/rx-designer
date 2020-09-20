import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarbleLineComponent } from './marble-line/marble-line.component';
import { MarblesComponent } from './marbles.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IsTargetPipe } from './is-target.pipe';

@NgModule({
  declarations: [MarbleLineComponent, MarblesComponent, IsTargetPipe],
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  exports: [MarblesComponent]
})
export class MarblesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeDetailsComponent } from './node-details.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [NodeDetailsComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatIconModule,
  ],
  exports: [
    NodeDetailsComponent
  ]
})
export class NodeDetailsModule { }

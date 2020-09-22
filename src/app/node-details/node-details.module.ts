import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeDetailsComponent } from './node-details.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NodeInputComponent } from './node-input/node-input.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NodeDetailsComponent, NodeInputComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatIconModule,
    MatRippleModule,
    ReactiveFormsModule,
  ],
  exports: [
    NodeDetailsComponent
  ]
})
export class NodeDetailsModule { }

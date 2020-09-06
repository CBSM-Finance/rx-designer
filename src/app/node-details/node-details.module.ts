import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeDetailsComponent } from './node-details.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NodeArgComponent } from './node-arg/node-arg.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [NodeDetailsComponent, NodeArgComponent],
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

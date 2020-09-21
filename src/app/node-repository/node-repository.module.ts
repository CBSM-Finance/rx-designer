import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeRepositoryComponent } from './node-repository.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [NodeRepositoryComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
  ],
  exports: [
    NodeRepositoryComponent
  ]
})
export class NodeRepositoryModule { }

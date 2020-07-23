import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeRepositoryComponent } from './node-repository.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [NodeRepositoryComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    NodeRepositoryComponent
  ]
})
export class NodeRepositoryModule { }

import { Component, OnInit } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { MarblesService } from './marbles.service';
import { Observable } from 'rxjs';
import { DesignerNode } from '../nodes/designer-node';
import { connectedNodes } from './connected-nodes';

@Component({
  selector: 'app-marbles',
  templateUrl: './marbles.component.html',
  styleUrls: ['./marbles.component.scss']
})
export class MarblesComponent implements OnInit {
  nodes: Observable<DesignerNode[]>;

  constructor(
    public ms: MarblesService,
  ) {
    this.nodes = ms.graph.pipe(
      map(connectedNodes),
    );
  }

  ngOnInit(): void {
  }
}

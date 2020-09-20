import { Injectable } from '@angular/core';
import { DesignerNode, DesignerNodeOutput } from '../nodes/designer-node';
import { ReplaySubject, Observable, Subject } from 'rxjs';
import { ReactiveGraph, Connection } from '@cbsm-finance/reactive-nodes';
import { distinctUntilChanged, filter, repeat, repeatWhen, scan, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarblesService {
  marbles: Observable<MarbleStateUpdate[]>;
  graph: Observable<ReactiveGraph<DesignerNode>>;

  private marblesSub = new ReplaySubject<MarbleStateUpdate>();
  private graphSub = new Subject<ReactiveGraph<DesignerNode>>();

  constructor() {
    this.marbles = this.marblesSub.pipe(
      scan((acc, marble) => marble === void 0 ? [] : [...acc, marble], []),
    );
    this.graph = this.graphSub.pipe(
      distinctUntilChanged(),
      filter<ReactiveGraph<DesignerNode>>(Boolean),
    );
  }

  nodeOutput(node: DesignerNode, output: DesignerNodeOutput, data: any, graph: ReactiveGraph<DesignerNode>): void {
    this.graphSub.next(graph);

    const { nodes, edges } = graph;
    const nodeIndex = nodes.indexOf(node);
    const targets = Object.entries(edges[nodeIndex])
      .filter(([, conns]) => conns !== 0)
      .map(([i, conns]) => {
        const targetNode = nodes[i];
        return (conns as Connection[]).map(([, port]) => ({
          node: targetNode,
          port,
        }));
      }).flat();

    this.marblesSub.next({
      node,
      output,
      data,
      targets,
      timestamp: new Date().getTime(),
    });
  }

  reset() {
    this.graphSub.next(void 0);
    this.marblesSub.next(void 0);
  }
}

export interface MarbleStateUpdate {
  node: DesignerNode;
  output: DesignerNodeOutput;
  data: any;
  targets: {
    node: DesignerNode;
    port: number;
  }[];
  timestamp: number;
}

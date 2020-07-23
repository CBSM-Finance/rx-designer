import { Component, ViewChild, ViewChildren, OnInit, AfterViewInit } from '@angular/core';
import { Designer } from './designer/designer';
import * as json from './conf.json';
import { ReactiveGraph, NumberNode, Node, StringNode, MeanNode, PrintNode, BaseNode } from '@cbsm-finance/reactive-nodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  private designer: Designer;

  constructor() {
  }

  ngAfterViewInit() {
    const canvas = document.querySelectorAll('canvas')[1] as HTMLCanvasElement;
    const bgCanvas = document.querySelectorAll('canvas')[0] as HTMLCanvasElement;
    canvas.width = bgCanvas.width = canvas.clientWidth;
    canvas.height = bgCanvas.height = canvas.clientHeight;
    this.designer = Designer.fromJson((json as any).default, canvas, bgCanvas);
  }

  run() {
    this.designer.run();
  }

  addNode(node: Node) {
    this.designer.addNode(node);
  }
}

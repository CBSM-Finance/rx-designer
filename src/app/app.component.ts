import {
  Component,
  AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { Designer } from './designer/designer';
import * as json from './conf.json';
import { DesignerNode } from './nodes/designer-node';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  designer: Designer;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {
    const canvas = document.querySelectorAll('canvas')[1] as HTMLCanvasElement;
    const bgCanvas = document.querySelectorAll(
      'canvas'
    )[0] as HTMLCanvasElement;
    canvas.width = bgCanvas.width = canvas.clientWidth;
    canvas.height = bgCanvas.height = canvas.clientHeight;
    const graphJson = localStorage.getItem('graph') || (json as any).default;
    this.designer = Designer.fromJson(graphJson, canvas, bgCanvas);
    this.cdRef.detectChanges();
  }

  addNode(node: DesignerNode) {
    this.designer.addNode(node);
  }
}

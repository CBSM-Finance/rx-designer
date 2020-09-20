import {
  Component,
  AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { Designer } from './designer/designer';
import * as json from './conf.json';
import { DesignerNode } from './nodes/designer-node';
import { combineLatest, fromEvent, of } from 'rxjs';
import { MarblesService } from './marbles/marbles.service';
import { subtract } from './glue';
import { LoggerService } from './logger.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  designer: Designer;

  constructor(
    private ms: MarblesService,
    private logger: LoggerService,
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
    this.designer = Designer.fromJson(graphJson, canvas, bgCanvas, this.ms, this.logger);
    this.cdRef.detectChanges();
  }

  addNode(node: DesignerNode) {
    this.designer.addNode(node);
  }
}

import {
  Component,
  AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { Designer } from './designer/designer';
import * as json from './conf.json';
import { DesignerNode } from './nodes/designer-node';
import { MarblesService } from './marbles/marbles.service';
import { LoggerService } from './logger.service';
import { loadIconFont } from './designer/load-icon-font';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  designer: Designer;

  private loadIconFont = loadIconFont();

  constructor(
    private ms: MarblesService,
    private logger: LoggerService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {
    this.loadIconFont.then(() => {
      const canvas = document.querySelectorAll('canvas')[1] as HTMLCanvasElement;
      const bgCanvas = document.querySelectorAll(
        'canvas'
      )[0] as HTMLCanvasElement;
      const graphJson = localStorage.getItem('graph') || (json as any).default;
      this.designer = Designer.fromJson(graphJson, canvas, bgCanvas, this.ms, this.logger);
    });
  }

  addNode(node: DesignerNode) {
    this.designer.addNode(node);
  }

  action(name: string) {
    switch (name) {
      case 'reload':
        this.designer.repaint();
        break;
        case 'reload':
        this.designer.reload();
        break;
      }
  }
}

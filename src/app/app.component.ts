import {
  Component,
  AfterViewInit,
} from '@angular/core';
import { Designer } from './designer/designer';
import * as json from './conf.json';
import { DesignerNode } from './nodes/designer-node';
import { ElectronCommunicationService } from './electron-communication.service';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  designer: Designer;

  constructor(
    private ecs: ElectronCommunicationService,
    es: ElectronService,
  ) { }

  ngAfterViewInit() {
    const canvas = document.querySelectorAll('canvas')[1] as HTMLCanvasElement;
    const bgCanvas = document.querySelectorAll(
      'canvas'
    )[0] as HTMLCanvasElement;
    canvas.width = bgCanvas.width = canvas.clientWidth;
    canvas.height = bgCanvas.height = canvas.clientHeight;
    this.designer = Designer.fromJson((json as any).default, canvas, bgCanvas);
  }

  run() {
    this.designer.run({
      electron: this.ecs,
    });
  }

  addNode(node: DesignerNode) {
    this.designer.addNode(node);
  }
}

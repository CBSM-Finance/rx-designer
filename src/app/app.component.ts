import {
  Component,
  AfterViewInit,
} from '@angular/core';
import { Designer } from './designer/designer';
import * as json from './conf.json';
import { DesignerNode } from './nodes/designer-node';
import { ElectronCommunicationService } from './electron-communication.service';
import { tap } from 'rxjs/operators';
import { EMPTY, Subscription } from 'rxjs';
import { LoggerService } from './logger.service';
import { subtract } from './glue';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  designer: Designer;

  private sub: Subscription;

  constructor(
    private ecs: ElectronCommunicationService,
    private logger: LoggerService,
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
    if (this.sub) this.sub.unsubscribe();
    this.sub = this.designer.run({
      electron: this.ecs,
      logger: this.logger,
    });
  }

  addNode(node: DesignerNode) {
    this.designer.addNode(node);
  }
}

import { ReactiveGraph } from '@cbsm-finance/reactive-nodes';
import { merge, of, Subject, Observable, Subscriber } from 'rxjs';
import { tap, takeUntil, filter, finalize } from 'rxjs/operators';
import { DragHandler, Glue, glue, MouseEventHandler } from '../glue';
import { objToNode, nodeToObj } from './obj-to-node';
import { inPortsGlue } from './glues/in-ports';
import { outPortsGlue } from './glues/out-ports';
import { coreGlue } from './glues/core';
import { DesignerNode } from '../nodes/designer-node';
import { State } from '../state';
import { MarblesService } from '../marbles/marbles.service';
import { LoggerService } from '../logger.service';
import { fromEvent } from 'rxjs';
import { designerVars } from './designer-vars';
import { connectedNodes } from '../marbles/connected-nodes';
import { rxDesignerNodeBuilder } from './node-builder';
import { colors } from './colors';
import { connectionsGlue } from './glues/connections';
import { pixelRatio } from './pixel-ratio';
import { nodeGlue } from './glues/node';
import { NewConnectionDragHandler } from './drag-handlers/new-connection';
import { MoveNodeDragHandler } from './drag-handlers/move-node';
import { HoverMouseHandler } from './mouse-handlers/hover';
import { SelectNodeMouseHandler } from './mouse-handlers/select-node';
import { DisconnectPortMouseHandler } from './mouse-handlers/disconnect-port';

type DesignerConnection = {
  source: number;
  target: number;
  inPort: number;
  outPort: number;
};

export class Designer {
  selectedNode: DesignerNode = void 0;
  adjustedPositions: number[][];
  running: Observable<boolean>;
  connections: DesignerConnection[];
  glNodes: Glue[];
  dh: DragHandler;
  mh: MouseEventHandler;

  private newConnectionDragHandler = new NewConnectionDragHandler(this);
  private moveNodeDragHandler = new MoveNodeDragHandler(this);
  private hoverMouseHandler = new HoverMouseHandler(this);
  private selectNodeMouseHandler = new SelectNodeMouseHandler(this);
  private disconnectPortMouseHandler = new DisconnectPortMouseHandler(this);
  private runningSub = new Subject<boolean>();
  private unsub = new Subject<void>();

  static fromJson(
    json: string | any,
    canvas: HTMLCanvasElement,
    bgCanvas: HTMLCanvasElement,
    ms: MarblesService,
    logger: LoggerService,
  ): Designer {
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    const nodes = obj.nodes.map(o => objToNode(o));
    const edges = obj.edges;
    const graph = new ReactiveGraph<DesignerNode>(nodes, edges, {
      nodeBuilder: rxDesignerNodeBuilder(ms),
    });
    return new Designer(graph, obj.positions, canvas, bgCanvas, ms, logger);
  }

  getConnections(): {
    source: number;
    target: number;
    inPort: number;
    outPort: number;
  }[] {
    const connections: any = [];
    this.graph.edges.forEach((edges, source) => {
      edges.forEach((conns, target) => {
        if (conns === 0) return;
        conns.forEach(([outPort, inPort]) =>
          connections.push({
            source,
            target,
            outPort,
            inPort,
          }),
        );
      });
    });
    return (this.connections = connections);
  }

  zoom(factor = 0, mPos: { x: number; y: number } = void 0) {
    const newZoomFactor = Math.min(
      Math.max(designerVars.zoomFactor + factor, 0.6),
      1.4,
    );
    const delta = newZoomFactor - designerVars.zoomFactor;
    designerVars.zoomFactor = newZoomFactor;

    this.adjustedPositions = this.positions.map(([x, y]) => [
      x * designerVars.zoomFactor,
      y * designerVars.zoomFactor,
    ]);

    if (mPos) {
      const { translate } = designerVars;
      translate.x = Math.min(translate.x - mPos.x * delta, 0);
      translate.y = Math.min(translate.y - mPos.y * delta, 0);
    }

    this.reload();
    this.drawGrid(this.bgCanvas.getContext('2d'), this.bgCanvas);
  }

  save() {
    localStorage.setItem('graph', this.toJson());
  }

  addNode(node: DesignerNode) {
    this.graph.addNode(node);
    this.positions.push([8, 8]);
    this.zoom(0);
  }

  run(initState: any): () => void {
    const state = new State(initState);
    const nodes = connectedNodes(this.graph);

    // initialize all nodes
    nodes.forEach(node => node.initialize(state));
    const connectorNode = nodes.find(node => node.localId === 'connector');

    if (!connectorNode) throw Error('No connector node found.');
    this.runningSub.next(true);
    this.ms.reset();
    this.logger.reset();

    let killerObserver: Subscriber<any>;
    const killerObservable = new Observable(observer => {
      killerObserver = observer;
    });

    this.graph
      .execute(connectorNode, 0)
      .pipe(
        finalize(() => {
          this.runningSub.next(false);

          // kill all nodes
          nodes.forEach(node => node.kill());
        }),
        takeUntil(killerObservable),
      )
      .subscribe();

    return () => killerObserver.next(void 0);
  }

  constructor(
    public graph: ReactiveGraph<DesignerNode>,
    public positions: number[][],
    public canvas: HTMLCanvasElement,
    private bgCanvas: HTMLCanvasElement,
    private ms: MarblesService,
    private logger: LoggerService,
  ) {
    this.running = this.runningSub.asObservable();
    this.zoom(0);
    bgCanvas.style.backgroundColor = colors.bg;
    this.drawGrid(bgCanvas.getContext('2d'), bgCanvas);

    this.reload();
  }

  public removeNode(node: DesignerNode): void {
    if (this.selectedNode === node) {
      this.selectedNode = void 0;
    }
    const index = this.graph.nodes.indexOf(node);
    this.positions = this.positions.filter((pos, i) => i !== index);
    this.graph.removeNode(node);
    this.zoom(0);
  }

  private toJson(): string {
    const nodes = this.graph.nodes.map(nodeToObj);
    const obj = {
      name: 'Test XXX',
      nodes,
      edges: this.graph.edges,
      positions: this.positions,
    };
    return JSON.stringify(obj);
  }

  private reload() {
    this.reset();

    fromEvent(this.canvas, 'mousewheel')
      .pipe(
        filter((ev: WheelEvent) => ev.ctrlKey),
        tap((ev: WheelEvent) => {
          const rect = this.canvas.getBoundingClientRect();
          const mPos = {
            x: ev.pageX - rect.x,
            y: ev.pageY - rect.y,
          };
          this.zoom(Math.sign(ev.deltaY) * -0.04, mPos);
        }),
        takeUntil(this.unsub),
      )
      .subscribe();

    this.glNodes = this.graph.nodes.map(
      (node, i) =>
        nodeGlue(this, {
          x: this.adjustedPositions[i][0],
          y: this.adjustedPositions[i][1],
          node,
        }) as Glue,
    );
    this.getConnections();

    this.newConnectionDragHandler.reload();
    this.moveNodeDragHandler.reload();
    this.hoverMouseHandler.reload();
    this.selectNodeMouseHandler.reload();
    this.disconnectPortMouseHandler.reload();

    const resize = fromEvent(window, 'resize');

    resize
      .pipe(
        tap(() => {
          this.bgCanvas.width = this.canvas.clientWidth;
          this.bgCanvas.height = this.canvas.clientHeight;
          this.drawGrid(this.bgCanvas.getContext('2d'), this.bgCanvas);
        }),
        takeUntil(this.unsub),
      )
      .subscribe();

    merge(of(void 0), this.dh.markForRepaint, this.mh.markForRepaint, resize)
      .pipe(
        tap(() => {
          this.repaint();
        }),
        takeUntil(this.unsub),
      )
      .subscribe();
  }

  private reset() {
    this.unsub.next(void 0);
    if (this.dh) this.dh.unsubscribe();
    this.dh = new DragHandler(this.canvas);
    this.mh = new MouseEventHandler(this.canvas);
  }

  private resizeCanvas(ctx: CanvasRenderingContext2D): void {
    const ratio = pixelRatio();
    const { canvas } = this;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  private repaint() {
    const ctx = this.canvas.getContext('2d');

    this.resizeCanvas(ctx);

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.translate(designerVars.translate.x, designerVars.translate.y);

    this.newConnectionDragHandler.paint(this.canvas);
    this.glNodes.forEach(g => g.paint(this.canvas));

    const lines = connectionsGlue(this) as Glue[];
    lines.forEach(g => g.paint(this.canvas));
  }

  private drawGrid(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const w = canvas.width;
    const h = canvas.height;
    const gridSize = designerVars.adjCellSize() * 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const translateX = designerVars.translate.x % gridSize;
    const translateY = designerVars.translate.y % gridSize;

    for (let y = translateY; y < h; y += gridSize) {
      for (let x = translateX; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.fillStyle = colors.grid;
        ctx.arc(x, y, 1 * designerVars.zoomFactor, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

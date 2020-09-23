import { ReactiveGraph } from '@cbsm-finance/reactive-nodes';
import {
  merge,
  of,
  Subject,
  Observable,
  EMPTY, Subscriber
} from 'rxjs';
import { tap, takeUntil, observeOn, filter } from 'rxjs/operators';
import { DragHandler, Glue, glue, subtract, MouseEventHandler } from '../glue';
import { objToNode, nodeToObj } from './obj-to-node';
import { inPortGlue } from './glues/in-port';
import { outPortGlue } from './glues/out-port';
import { coreGlue } from './glues/core';
import { DesignerNode } from '../nodes/designer-node';
import { State } from '../state';
import { NodeBuilder } from '@cbsm-finance/reactive-nodes/dist/reactive-graph';
import { MarblesService } from '../marbles/marbles.service';
import { LoggerService } from '../logger.service';
import { asapScheduler, fromEvent } from 'rxjs';
import { designerVars } from './designer-vars';
import { connectedNodes } from '../marbles/connected-nodes';
import { titleGlue } from './glues/title';
import { labelGlue } from './glues/label';

const colors = {
  bg: '#fff',
  grid: '#e2e2e4',
  ports: '#888',
  label: '#000',
  connections: 'rgba(0,0,180,.6)',
  dragConnection: '#aaa',
};

/**
 * Custom node builder that resolves fallback values.
 */
export const rxDesignerNodeBuilder = (ms: MarblesService): NodeBuilder => (
  node: DesignerNode,
  inputs,
  graph: ReactiveGraph<DesignerNode>
) => {
  const resolvedInputs = inputs.map((input, i) => {
    if (input !== EMPTY) return input;
    const fallbackVal = node.inputs[i].value;
    if (fallbackVal === void 0) return EMPTY;
    return of(fallbackVal);
  });
  return (node.connect(resolvedInputs) as Observable<any>[]).map((output, i) =>
    output.pipe(
      observeOn(asapScheduler),
      tap((data) => ms.nodeOutput(node, node.outputs[i], data, graph))
    )
  );
};

export class Designer {
  selectedNode: DesignerNode = void 0;
  adjustedPositions: number[][];

  private dh: DragHandler;
  private mh: MouseEventHandler;
  private connections: {
    source: number;
    target: number;
    inPort: number;
    outPort: number;
  }[];
  private glNodes: Glue[];
  private dragConnection = void 0;
  private unsub = new Subject<void>();

  static fromJson(
    json: string | any,
    canvas: HTMLCanvasElement,
    bgCanvas: HTMLCanvasElement,
    ms: MarblesService,
    logger: LoggerService
  ): Designer {
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    const nodes = obj.nodes.map((o) => objToNode(o));
    const edges = obj.edges;
    const graph = new ReactiveGraph<DesignerNode>(nodes, edges, {
      nodeBuilder: rxDesignerNodeBuilder(ms),
    });
    return new Designer(graph, obj.positions, canvas, bgCanvas, ms, logger);
  }

  zoom(factor = 0, mPos: { x: number, y: number } = void 0) {
    const newZoomFactor = Math.min(Math.max(designerVars.zoomFactor + factor, .6), 1.4);
    const delta = newZoomFactor - designerVars.zoomFactor;
    designerVars.zoomFactor = newZoomFactor;

    this.adjustedPositions = this.positions.map(([x, y]) => [x * designerVars.zoomFactor, y * designerVars.zoomFactor]);

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
    nodes.forEach((node) => node.initialize(state));

    const lastNode = nodes.find((node) => node.localId === 'connector');

    if (!lastNode) throw Error('No last node found.');

    this.ms.reset();
    this.logger.reset();

    let killerObserver: Subscriber<any>;
    const killerObservable = new Observable(observer => {
      killerObserver = observer;
    });

    this.graph.execute(lastNode, 0).pipe(
      takeUntil(killerObservable),
    ).subscribe(
      () => {},
      (err) => {
        console.log('err', err);

        // kill all nodes
        nodes.forEach((node) => node.kill());
      },
      () => {
        console.log('COMPLETE');

        // kill all nodes
        nodes.forEach((node) => node.kill());
      }
    );

    return () => killerObserver.next(void 0);
  }

  constructor(
    public graph: ReactiveGraph<DesignerNode>,
    private positions: number[][],
    private canvas: HTMLCanvasElement,
    private bgCanvas: HTMLCanvasElement,
    private ms: MarblesService,
    private logger: LoggerService
  ) {
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

    fromEvent(this.canvas, 'mousewheel').pipe(
      filter((ev: WheelEvent) => ev.ctrlKey),
      tap((ev: WheelEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        const mPos = {
          x: ev.pageX - rect.x,
          y: ev.pageY - rect.y,
        };
        this.zoom(Math.sign(ev.deltaY) * -.04, mPos);
      }),
      takeUntil(this.unsub),
    ).subscribe();

    this.glNodes = this.graph.nodes.map((node, i) =>
      this.addItem(this.adjustedPositions[i][0], this.adjustedPositions[i][1], node)
    );
    this.getConnections();

    this.glNodes.forEach((gl, i) => {
      const core = gl.query('core')[0];
      this.mh.register(core, {
        onMove: (ev: MouseEvent) => {
          const rect = this.canvas.getBoundingClientRect();
          const { translate } = designerVars;
          return (core.props.hover =
            core.intersect(ev.pageX - rect.x - translate.x, ev.pageY - rect.y - translate.y).length > 0);
        },
      });

      gl.query('in-port')
        .concat(gl.query('out-port'))
        .forEach((port) => {
          this.mh.register(port, {
            onMove: (ev: MouseEvent) => {
              const rect = this.canvas.getBoundingClientRect();
              const { translate } = designerVars;
              return (port.props.hover =
                port.intersect(ev.pageX - rect.x - translate.x, ev.pageY - rect.y - translate.y).length >
                0);
            },
          });
        });

      gl.query('out-port').forEach((port, outPort) => {
        this.dh.register(port, {
          setRef: (dg) => dg.path[0],
          onMove: ({ glue, delta }) => {
            this.dragConnection = {
              from: glue.center(),
              to: delta,
            };
          },
          onDrop: ({ event }) => {
            this.glNodes.find((g, h) => {
              if (g === gl) return false;
              const rect = this.canvas.getBoundingClientRect();
              const { translate } = designerVars;
              const inPort = g
                .query('in-port')
                .findIndex(
                  (p) =>
                    p.intersect(event.pageX - rect.x - translate.x, event.pageY - rect.y - translate.y)
                      .length > 0
                );
              if (inPort === -1) return false;
              const target = this.graph.nodes[h];
              const source = this.graph.nodes[i];
              const currentIncomingNode = this.graph.incomingNode(
                target,
                inPort
              );
              if (currentIncomingNode) {
                this.graph.disconnect(currentIncomingNode, target, inPort);
              }
              this.graph.connect(source, target, outPort, inPort);
              this.getConnections();
              return true;
            });
            this.dragConnection = void 0;
          },
        });
      });

      this.dh.register(
        gl,
        {
          setRef: (dg) => dg.path[0],
          onMove: ({ glue, startOffset, delta }) => {
            const props = glue.props;
            props.xOffsetPx = startOffset.x + delta.x;
            props.yOffsetPx = startOffset.y + delta.y;

            // update pos in source data
            const nodeIndex = this.glNodes.indexOf(glue);
            this.positions[nodeIndex] = [
              (props.xPx + props.xOffsetPx) / designerVars.zoomFactor,
              (props.yPx + props.yOffsetPx) / designerVars.zoomFactor,
            ];
          },
        },
        'core'
      );

      gl.query('in-port').forEach((port, inPort) => {
        this.mh.register(port, {
          onClick: () => {
            const nodes = this.graph.nodes;
            const incomingNode = this.graph.incomingNode(nodes[i], inPort);
            if (!incomingNode) return false;
            this.graph.disconnect(incomingNode, nodes[i], inPort);
            this.getConnections();
          },
        });
      });

      this.mh.register(gl.query('core')[0], {
        onClick: () => (this.selectedNode = this.graph.nodes[i]),
      });
    });

    const resize = fromEvent(window, 'resize');

    resize
      .pipe(
        tap(() => {
          this.bgCanvas.width = this.canvas.clientWidth;
          this.bgCanvas.height = this.canvas.clientHeight;
          this.drawGrid(this.bgCanvas.getContext('2d'), this.bgCanvas);
        }),
        takeUntil(this.unsub)
      )
      .subscribe();

    merge(of(void 0), this.dh.markForRepaint, this.mh.markForRepaint, resize)
      .pipe(
        tap(() => {
          this.repaint();
        }),
        takeUntil(this.unsub)
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

    if (this.dragConnection) {
      glue({
        xPx: this.dragConnection.from.x,
        yPx: this.dragConnection.from.y,
        wPx: this.dragConnection.to.x,
        hPx: this.dragConnection.to.y,
        asLine: true,
        color: colors.connections,
        customPaint: (gl, ctx) => {
          const { pos, dim } = gl.cache;
          const offset = 0;
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = colors.dragConnection;
          ctx.setLineDash([4, 8]);
          ctx.lineWidth = 2;
          ctx.moveTo(pos.x + offset, pos.y);
          const toX = pos.x + dim.x - offset;
          const toY = pos.y + dim.y;
          const delta = Math.sqrt(
            Math.pow(pos.x - toX, 2) + Math.pow(pos.y - toY, 2)
          );
          const smoothing = delta * 0.1;
          ctx.bezierCurveTo(
            pos.x + smoothing + offset,
            pos.y,
            toX - smoothing,
            toY,
            toX,
            toY
          );
          ctx.stroke();
          ctx.closePath();
          ctx.restore();
        },
      }).paint(this.canvas);
    }

    this.glNodes.forEach((g) => g.paint(this.canvas));

    const lines = this.connections.map(
      ({ source, target, inPort, outPort }) => {
        const a = this.glNodes[source].query('out-port')[outPort].centerRight();
        const b = this.glNodes[target].query('in-port')[inPort].centerLeft();
        const dim = subtract(b, a);
        return glue({
          xPx: a.x,
          yPx: a.y,
          wPx: dim.x,
          hPx: dim.y,
          asLine: true,
          color: colors.connections,
          customPaint: (gl, ctx) => {
            const { pos, dim } = gl.cache;
            const offset = 2;
            ctx.beginPath();
            ctx.strokeStyle = gl.props.color || 'white';
            ctx.lineWidth = 2 * designerVars.zoomFactor;
            ctx.moveTo(pos.x + offset, pos.y);
            const toX = pos.x + dim.x - offset;
            const toY = pos.y + dim.y;
            const delta = Math.sqrt(
              Math.pow(pos.x - toX, 2) + Math.pow(pos.y - toY, 2)
            );
            const smoothing = delta * 0.1;
            ctx.bezierCurveTo(
              pos.x + smoothing + offset,
              pos.y,
              toX - smoothing,
              toY,
              toX,
              toY
            );
            ctx.stroke();
            ctx.closePath();
          },
        });
      }
    );
    lines.forEach((g) => g.paint(this.canvas));
  }

  private getConnections(): {
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
          })
        );
      });
    });
    return (this.connections = connections);
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

  private addItem(x: number, y: number, node: DesignerNode): Glue {
    const gridSize = designerVars.adjCellSize() * 2;
    const gl = glue(
      {
        wPx: designerVars.adjCellSize() * 4,
        hPx: designerVars.adjCellSize() * 4,
        xPx: x,
        yPx: y,
        snapToGrid: gridSize,
        color: 'transparent',
      },
      [
        coreGlue(this, node),
        this.getInPorts(node.inputs.length, node),
        this.getOutPorts(node.outputs.length, node),
        labelGlue(node, colors),
        titleGlue(node),
      ]
    );
    return gl;
  }

  private getOutPorts(count: number, node: DesignerNode) {
    const items = [];
    const cellSize = designerVars.adjCellSize();
    const coreHeight = cellSize * 4;
    const outPortHeight = cellSize;
    const coreCenter = coreHeight / 2;
    const outPortsHeight = count * outPortHeight;
    const offsetY = coreCenter - outPortsHeight / 2;

    for (let i = 0; i < count; i++) {
      const y = offsetY + i * cellSize;
      items.push(outPortGlue(y, i, node, this.graph));
    }
    return glue(
      {
        hPx: cellSize,
        wPx: cellSize,
        xPx: 0,
        color: 'transparent',
        anchor: 'topRight',
      },
      items
    );
  }

  private getInPorts(count: number, node: DesignerNode) {
    const items = [];
    const cellSize = designerVars.adjCellSize();
    const coreHeight = cellSize * 4;
    const inPortHeight = cellSize;
    const coreCenter = coreHeight / 2;
    const inPortsHeight = count * inPortHeight;
    const offsetY = coreCenter - inPortsHeight / 2;

    for (let i = 0; i < count; i++) {
      const y = offsetY + i * cellSize;
      items.push(inPortGlue(y, i, node, this.graph));
    }

    return glue(
      {
        hPx: cellSize,
        wPx: cellSize,
        xPx: -cellSize,
        color: 'transparent',
      },
      items
    );
  }
}

declare const FontFace: any;

export function loadIconFont(): Promise<any> {
  const materialFont = new FontFace('material-icons', 'url(https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2)');
  (document as any).fonts.add(materialFont);
  return materialFont.load();
}

export function connInputsCount(node: DesignerNode, index: number, graph: ReactiveGraph<DesignerNode>): number {
  let count = 0;
  for (let i = 0; i < index; i++) {
    const conn = graph.incomingNode(node, i);
    if (!conn) continue;
    count++;
  }
  return count;
}

export interface MktData {
  high: number;
  low: number;
  bid: number;
  ask: number;
}

function pixelRatio() {
  const ctx = document.createElement('canvas').getContext('2d') as any;
  const dpr = window.devicePixelRatio || 1;
  const bsr = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
}

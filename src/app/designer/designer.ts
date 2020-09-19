import { ReactiveGraph } from '@cbsm-finance/reactive-nodes';
import { merge, of, from, Subject, Subscription, fromEvent, Observable, EMPTY } from 'rxjs';
import { tap, takeUntil, switchMapTo, share } from 'rxjs/operators';
import { DragHandler, Glue, glue, subtract, MouseEventHandler } from '../glue';
import { objToNode, nodeToObj } from './obj-to-node';
import { inPortGlue } from './glues/in-port';
import { outPortGlue } from './glues/out-port';
import { coreGlue } from './glues/core';
import { labelGlue } from './glues/label';
import { DesignerNode } from '../nodes/designer-node';
import { State } from '../state';
import { NodeBuilder } from '@cbsm-finance/reactive-nodes/dist/reactive-graph';

const colors = {
  bg: '#121218',
  grid: '#444',
  ports: '#fff',
  label: '#fff',
  connections: '#fff',
  dragConnection: '#aaa',
};

/**
 * Custom node builder that resolves fallback values.
 */
export const rxDesignerNodeBuilder: NodeBuilder = (node: DesignerNode, inputs) => {
  const resolvedInputs = inputs.map((input, i) => {
    if (input !== EMPTY) return input;
    const fallbackVal = node.inputs[i].value;
    if (fallbackVal === void 0) return EMPTY;
    return of(fallbackVal);
  });
  return node.connect(resolvedInputs) as Observable<any>[];
};

export class Designer {
  gridSize = 16;
  selectedNode: DesignerNode = void 0;

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
    bgCanvas: HTMLCanvasElement
  ): Designer {
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    const nodes = obj.nodes.map(o => objToNode(o));
    const edges = obj.edges;
    const graph = new ReactiveGraph<DesignerNode>(nodes, edges, {
      nodeBuilder: rxDesignerNodeBuilder,
    });
    return new Designer(graph, obj.positions, canvas, bgCanvas);
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

  save() {
    localStorage.setItem('graph', this.toJson());
  }

  addNode(node: DesignerNode) {
    this.graph.addNode(node);
    this.positions.push([8, 8]);
    this.reload();
  }

  run(initState: any): Subscription {
    const state = new State(initState);
    const { nodes } = this.graph;

    // initialize all nodes
    nodes.forEach((node) => node.initialize(state));

    const lastNode = nodes.find((node) => node.localId === 'connector');

    if (!lastNode) throw Error('No last node found.');

    return this.graph.execute(lastNode, 0).subscribe(
      () => {},
      () => {},
      () => {
        // kill all nodes
        nodes.forEach((node) => node.kill());
      }
    );
  }

  constructor(
    private graph: ReactiveGraph<DesignerNode>,
    private positions: number[][],
    private canvas: HTMLCanvasElement,
    private bgCanvas: HTMLCanvasElement
  ) {
    bgCanvas.style.backgroundColor = colors.bg;
    this.drawGrid(bgCanvas.getContext('2d'), bgCanvas);

    this.reload();
  }

  private reload() {
    this.reset();

    this.glNodes = this.graph.nodes.map((node, i) =>
      this.addItem(this.positions[i][0], this.positions[i][1], node)
    );
    this.getConnections();

    this.glNodes.forEach((gl, i) => {
      const core = gl.query('core')[0];
      this.mh.register(core, {
        onMove: (ev: MouseEvent) => {
          const rect = this.canvas.getBoundingClientRect();
          return (core.props.hover =
            core.intersect(ev.pageX - rect.x, ev.pageY - rect.y).length > 0);
        },
      });

      gl.query('in-port')
        .concat(gl.query('out-port'))
        .forEach((port) => {
          this.mh.register(port, {
            onMove: (ev: MouseEvent) => {
              const rect = this.canvas.getBoundingClientRect();
              return (port.props.hover =
                port.intersect(ev.pageX - rect.x, ev.pageY - rect.y).length >
                0);
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
              props.xPx + props.xOffsetPx,
              props.yPx + props.yOffsetPx,
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

      gl.query('out-port').forEach((port, outPort) => {
        this.dh.register(port, {
          setRef: (dg) => dg.path[0],
          onMove: ({ glue, startOffset, delta }) => {
            this.dragConnection = {
              from: glue.center(),
              to: delta,
            };
          },
          onDrop: ({ event }) => {
            this.glNodes.find((g, h) => {
              if (g === gl) return false;
              const rect = this.canvas.getBoundingClientRect();
              const inPort = g
                .query('in-port')
                .findIndex(
                  (p) =>
                    p.intersect(event.pageX - rect.x, event.pageY - rect.y)
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

  private repaint() {
    const ctx = this.canvas.getContext('2d');

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
            ctx.lineWidth = 1;
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

    for (let y = 0; y < h; y += this.gridSize) {
      for (let x = 0; x < w; x += this.gridSize) {
        ctx.beginPath();
        ctx.fillStyle = colors.grid;
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  private addItem(x: number, y: number, node: DesignerNode): Glue {
    const gl = glue(
      {
        wPx: this.gridSize * 4,
        hPx: this.gridSize * 2,
        xPx: x,
        yPx: y,
        snapToGrid: this.gridSize,
        color: 'transparent',
      },
      [
        this.getInPorts(node.inputs.length, node),
        coreGlue(this, node),
        this.getOutPorts(node.outputs.length, node),
        this.getLabel(node),
      ]
    );
    return gl;
  }

  private getLabel(node: DesignerNode): Glue {
    return labelGlue(node, colors);
  }

  private getOutPorts(count: number, node: DesignerNode) {
    const items = [];
    const height = 10;
    const d = height + 4;
    const parentHeight = this.gridSize * 2;
    for (let i = 0; i < count; i++) {
      items.push(
        outPortGlue(height, count, d, i, parentHeight, node, colors, this.graph)
      );
    }
    return glue(
      {
        hPc: 1,
        wPx: 10,
        xPx: -10,
        anchor: 'topRight',
        color: 'transparent',
      },
      items
    );
  }

  private getInPorts(count: number, node: DesignerNode) {
    const items = [];
    const height = 10;
    const d = height + 4;
    const parentHeight = this.gridSize * 2;
    for (let i = 0; i < count; i++) {
      items.push(
        inPortGlue(height, count, d, i, parentHeight, node, colors, this.graph)
      );
    }
    return glue(
      {
        hPc: 1,
        wPx: 10,
        xPx: 0,
        color: 'transparent',
      },
      items
    );
  }
}

export interface MktData {
  high: number;
  low: number;
  bid: number;
  ask: number;
}

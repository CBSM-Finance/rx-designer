import { ReactiveGraph } from '@cbsm-finance/reactive-nodes';
import { merge, of, from, Subject, Subscription } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { DragHandler, Glue, glue, subtract, MouseEventHandler } from '../glue';
import { objToNode } from './obj-to-node';
import { inPortGlue } from './glues/in-port';
import { outPortGlue } from './glues/out-port';
import { coreGlue } from './glues/core';
import { labelGlue } from './glues/label';
import { DesignerNode } from '../nodes/designer-node';
import { State } from '../state';

const colors = {
  bg: '#121218',
  grid: '#444',
  ports: '#fff',
  label: '#fff',
  connections: '#fff',
  dragConnection: '#aaa',
};

export class Designer {
  gridSize = 16;
  selectedNode: DesignerNode = void 0;

  private dh: DragHandler;
  private mh: MouseEventHandler;
  private connections: { source: number; target: number; port: number }[];
  private glNodes: Glue[];
  private dragConnection = void 0;
  private unsub = new Subject<void>();

  static fromJson(
    json: string | any,
    canvas: HTMLCanvasElement,
    bgCanvas: HTMLCanvasElement
  ): Designer {
    const scope = {
      reqMktData: (contract) => {
        return from([
          { symbol: contract.symbol, bid: Math.random() },
          { symbol: contract.symbol, ask: Math.random() },
          { symbol: contract.symbol, bid: Math.random() },
          { symbol: contract.symbol, ask: Math.random() },
        ]);
      },
    };

    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    const nodes = obj.nodes.map((o) => objToNode(o, scope));
    const edges = obj.edges;
    const graph = new ReactiveGraph<DesignerNode>(nodes, edges);
    return new Designer(graph, obj.positions, canvas, bgCanvas);
  }

  addNode(node: DesignerNode) {
    this.graph.addNode(node);
    this.positions.push([8, 8]);
    this.reload();
  }

  run(initState: any): Subscription {
    const state = new State(initState);
    const { nodes } = this.graph;

    // connect all nodes
    nodes.forEach(node => node.connect(state));

    const firstNode = nodes[nodes.length - 1];
    return this.graph.execute(firstNode).subscribe(() => {}, () => {}, () => {

      // disconnect all nodes
      nodes.forEach(node => node.disconnect());
    });
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
          },
        },
        'core'
      );

      gl.query('in-port').forEach((port, h) => {
        this.mh.register(port, {
          onClick: () => {
            const nodes = this.graph.nodes;
            const incomingNode = this.graph.incomingNode(nodes[i], h + 1);
            if (!incomingNode) return false;
            this.graph.disconnect(incomingNode, nodes[i]);
            this.getConnections();
          },
        });
      });

      this.mh.register(gl.query('core')[0], {
        onClick: () => (this.selectedNode = this.graph.nodes[i]),
      });

      gl.query('out-port').forEach((port) => {
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
              const portI = g
                .query('in-port')
                .findIndex(
                  (p) =>
                    p.intersect(event.pageX - rect.x, event.pageY - rect.y)
                      .length > 0
                );
              if (portI === -1) return false;
              const target = this.graph.nodes[h];
              const source = this.graph.nodes[i];
              const currentIncomingNode = this.graph.incomingNode(
                target,
                portI + 1
              );
              if (currentIncomingNode) {
                this.graph.disconnect(currentIncomingNode, target);
              }
              this.graph.connect(source, target, portI + 1);
              this.getConnections();
              return true;
            });
            this.dragConnection = void 0;
          },
        });
      });
    });

    merge(of(void 0), this.dh.markForRepaint, this.mh.markForRepaint)
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
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const lines = this.connections.map(({ source, target, port }) => {
      const a = this.glNodes[source].query('out-port')[0].centerRight();
      const b = this.glNodes[target].query('in-port')[port - 1].centerLeft();
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
        },
      });
    });
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

  private getConnections(): { source: number; target: number; port: number }[] {
    const connections: any = [];
    this.graph.edges.forEach((edges, source) => {
      edges.forEach((port, target) => {
        if (port === 0) return;
        connections.push({
          source,
          target,
          port,
        });
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
        xPx: x * this.gridSize * 4,
        yPx: y * this.gridSize * 4,
        snapToGrid: this.gridSize,
        color: 'transparent',
      },
      [
        this.getInPorts(node.args.length, node),
        coreGlue(this, node),
        this.getOutPorts(1, node),
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

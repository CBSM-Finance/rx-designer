import { Glue, glue, add, subtract } from '../../glue';
import { colors } from '../colors';
import { Designer } from '../designer';
import { designerVars } from '../designer-vars';

export interface DragConnection {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export class NewConnectionDragHandler {
  private dragConnection = void 0;
  private docking = false;

  paint(canvas: HTMLCanvasElement) {
    if (!this.dragConnection) return;
    glue({
      xPx: this.dragConnection.from.x,
      yPx: this.dragConnection.from.y,
      wPx: this.dragConnection.to.x,
      hPx: this.dragConnection.to.y,
      asLine: true,
      customPaint: (gl, ctx) => {
        const { pos, dim } = gl.cache;
        const offset = 0;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.docking ? colors.dragConnectionDocking : colors.dragConnection;
        ctx.setLineDash([4, 8]);
        ctx.lineWidth = 2;
        ctx.moveTo(pos.x + offset, pos.y);
        const toX = pos.x + dim.x - offset;
        const toY = pos.y + dim.y;
        const delta = Math.sqrt(
          Math.pow(pos.x - toX, 2) + Math.pow(pos.y - toY, 2),
        );
        const smoothing = delta * 0.1;
        ctx.bezierCurveTo(
          pos.x + smoothing + offset,
          pos.y,
          toX - smoothing,
          toY,
          toX,
          toY,
        );
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      },
    }).paint(canvas);
  }

  reload() {
    const { glNodes, dh, graph, canvas } = this.designer;

    glNodes.forEach((nodeGlue, i) => {
      nodeGlue.query('out-port').forEach((port, outPort) => {
        dh.register(port, {
          setRef: dg => dg.path[0],
          onMove: ({ glue, delta }) => {
            const center = glue.center();
            const inPort = this.hoveredInPort(nodeGlue, add(center, delta));
            this.docking = Boolean(inPort);
            this.dragConnection = {
              from: center,
              to: this.docking ? subtract(inPort.centerLeft(), center) : delta,
            };
          },
          onDrop: ({ event }) => {
            glNodes.find((g, h) => {
              if (g === nodeGlue) return false;
              const rect = canvas.getBoundingClientRect();
              const { translate } = designerVars;
              const inPort = g
                .query('in-port')
                .findIndex(
                  p =>
                    p.intersect(
                      event.pageX - rect.x - translate.x,
                      event.pageY - rect.y - translate.y,
                    ).length > 0,
                );
              if (inPort === -1) return false;
              const target = graph.nodes[h];
              const source = graph.nodes[i];
              const currentIncomingNode = graph.incomingNode(target, inPort);
              if (currentIncomingNode) {
                graph.disconnect(currentIncomingNode, target, inPort);
              }
              graph.connect(source, target, outPort, inPort);
              this.designer.getConnections();
              return true;
            });
            this.dragConnection = void 0;
          },
        });
      });
    });
  }

  constructor(private designer: Designer) {}

  private hoveredInPort(excludeNode: Glue, pos: { x: number; y: number }): Glue {
    const { glNodes } = this.designer;
    const { translate } = designerVars;

    for (const nodeGlue of glNodes) {
      if (nodeGlue === excludeNode) continue;

      const inPort = nodeGlue
        .query('in-port')
        .find(port =>
          port.intersect(
            pos.x - translate.x,
            pos.y - translate.y,
          ).length > 0,
        );
      if (!inPort) continue;
      return inPort;
    }
  }
}

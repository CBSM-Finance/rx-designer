import { Designer } from '../designer';
import { designerVars } from '../designer-vars';
import { coreHeight } from '../core-height';
import { add, dot, subtract } from '../../glue';

export class MoveNodeDragHandler {
  dragPreview: { x: number; y: number; w: number; h: number };

  reload() {
    const { dh, glNodes, positions, graph } = this.designer;

    glNodes.forEach((gl, i) => {
      dh.register(
        gl,
        {
          setRef: dg => dg.path[0],
          onMove: ({ glue, startOffset, delta, mPos }) => {
            this.designer.toggleGrid(true);

            const props = glue.props;
            props.xOffsetPx = startOffset.x + delta.x;
            props.yOffsetPx = startOffset.y + delta.y;

            const cellSize = designerVars.adjCellSize();
            const grid = {
              x: cellSize * 14,
              y: cellSize * 2,
            };

            // update pos in source data
            const nodeIndex = glNodes.indexOf(glue);
            positions[nodeIndex] = [
              (props.xPx + props.xOffsetPx) / designerVars.zoomFactor,
              (props.yPx + props.yOffsetPx) / designerVars.zoomFactor,
            ];

            const node = graph.nodes[i];
            this.dragPreview = {
              x: ~~(mPos.x / grid.x) * grid.x,
              y: ~~(positions[nodeIndex][1] / grid.y) * grid.y,
              w: cellSize * 12,
              h: coreHeight(node),
            };
          },
          onDrop: () => {
            const nodeIndex = glNodes.indexOf(gl);
            const startPos = {
              x: positions[nodeIndex][0],
              y: positions[nodeIndex][1],
            };
            const toPos = { ...this.dragPreview };
            this.dragPreview = void 0;
            const duration = 400;

            this.designer.toggleGrid(false);

            const animStartTime = new Date().getTime();
            const animate = () => {
              const time = new Date().getTime();
              const timeDiff = time - animStartTime;
              if (timeDiff >= duration) {
                positions[nodeIndex] = [toPos.x, toPos.y];
                this.designer.repaint();
                return;
              }
              const x = timeDiff / duration;
              const newPos = animateTo(startPos, toPos, x);
              positions[nodeIndex] = [newPos.x, newPos.y];
              this.designer.repaint();
              window.requestAnimationFrame(() => animate());
            };
            animate();

            // update pos in source data
            // positions[nodeIndex] = [
            //   (props.xPx + props.xOffsetPx) / designerVars.zoomFactor,
            //   (props.yPx + props.yOffsetPx) / designerVars.zoomFactor,
            // ];
          },
        },
        'core',
      );
    });
  }

  constructor(private designer: Designer) {}
}

function animateTo(
  from: { x: number; y: number },
  to: { x: number; y: number },
  x: number,
) {
  const dist = subtract(to, from);
  const f = easeOutElastic(x);
  const delta = dot(dist, { x: f, y: f });
  return add(from, delta);
}

function easeInOutBack(x: number): number {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

function easeOutElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }
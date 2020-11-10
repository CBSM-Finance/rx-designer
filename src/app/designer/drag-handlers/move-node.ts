import { Designer } from '../designer';
import { designerVars } from '../designer-vars';
import { coreHeight } from '../core-height';
import { add, dot, Glue, len, subtract } from '../../glue';

export class MoveNodeDragHandler {
  dragPreview: { x: number; y: number; w: number; h: number };

  reload() {
    const { dh, glNodes, positions, graph } = this.designer;

    function translateWithDelta(
      glue: Glue,
      startOffset: { x: number; y: number },
      delta: { x: number; y: number },
    ) {
      const props = glue.props;
      props.xOffsetPx = startOffset.x + delta.x;
      props.yOffsetPx = startOffset.y + delta.y;
      const nodeIndex = glNodes.indexOf(glue);
      positions[nodeIndex] = [
        props.xPx + props.xOffsetPx,
        props.yPx + props.yOffsetPx,
      ];
    }

    function translateAbsolute(glue: Glue, pos: { x: number; y: number }) {
      const nodeIndex = glNodes.indexOf(glue);
      positions[nodeIndex] = [pos.x, pos.y];
      const props = glue.props;
      props.xPx = pos.x;
      props.yPx = pos.y;
      props.xOffsetPx = 0;
      props.yOffsetPx = 0;
    }

    glNodes.forEach((gl, i) => {
      dh.register(
        gl,
        {
          setRef: dg => dg.path[0],
          onMove: ({ glue, startOffset, delta, mPos }) => {
            this.designer.toggleGrid(true);

            translateWithDelta(gl, startOffset, delta);

            const cellSize = designerVars.adjCellSize();
            const grid = {
              x: cellSize * 14,
              y: cellSize,
            };

            const nodeIndex = glNodes.indexOf(glue);
            const node = graph.nodes[i];
            this.dragPreview = {
              x: ~~(mPos.x / grid.x) * grid.x,
              y: ~~(positions[nodeIndex][1] / grid.y) * grid.y,
              w: cellSize * 12,
              h: coreHeight(node),
            };
          },
          onDrop: () => {
            if (!this.dragPreview) return;
            const nodeIndex = glNodes.indexOf(gl);
            const startPos = {
              x: positions[nodeIndex][0],
              y: positions[nodeIndex][1],
            };
            const toPos = { ...this.dragPreview };
            this.dragPreview = void 0;
            const duration = 400;

            this.designer.toggleGrid(false);

            // don't animate if movement was too little
            const deltaForAnim = 8;
            const dist = len(subtract(toPos, startPos));
            if (dist <= deltaForAnim) {
              translateAbsolute(gl, toPos);
              this.designer.repaint();
              return;
            }

            const animStartTime = new Date().getTime();
            const animate = () => {
              const time = new Date().getTime();
              const timeDiff = time - animStartTime;
              if (timeDiff >= duration) {
                translateAbsolute(gl, toPos);
                this.designer.repaint();
                return;
              }
              const x = timeDiff / duration;
              const newPos = animateTo(startPos, toPos, x);
              translateAbsolute(gl, newPos);
              this.designer.repaint();
              window.requestAnimationFrame(() => animate());
            };
            animate();
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

function easeOutElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

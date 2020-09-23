import { glue } from 'src/app/glue';
import { ReactiveGraph } from '@cbsm-finance/reactive-nodes';
import { paintX } from '../paint/x';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { designerVars } from '../designer-vars';

export function inPortGlue(
  y: number,
  i: number,
  node: DesignerNode,
  graph: ReactiveGraph<DesignerNode>,
) {
  const cellSize = designerVars.adjCellSize();

  return glue({
    wPc: 1,
    hPc: 1,
    yPx: y,
    xPx: 0,
    label: 'in-port',
    anchor: 'topLeft',
    customPaint: (gl, ctx) => {
      const { pos, dim } = gl.cache;
      const conn = graph.incomingNode(node, i);
      const input = node.inputs[i];

      ctx.lineWidth = 1;

      if (gl.props.hover) {

        // ctx.fillStyle = '#fff';
        // ctx.fillRect(pos.x, pos.y, 80, cellSize);

        // label
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'right';
        ctx.font = `500 ${8 * designerVars.zoomFactor}pt Roboto`;
        ctx.fillText(input.name, pos.x, pos.y + cellSize / 2);
        ctx.closePath();
      }

      const r = cellSize / 4;

      if (conn) {
        if (gl.props.hover) {
          ctx.strokeStyle = '#6a6ff2';
          paintX(ctx, pos, { x: cellSize, y: cellSize });
          ctx.stroke();
        }
        else {
          ctx.beginPath();
          ctx.fillStyle = '#6a6ff2';
          ctx.arc(pos.x + cellSize / 2, pos.y + cellSize / 2, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        }
      } else {
        ctx.beginPath();
        ctx.fillStyle = gl.props.hover ? '#6a6ff2' : '#aaaae2';
        ctx.arc(pos.x + cellSize / 2, pos.y + cellSize / 2, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    },
  });
}

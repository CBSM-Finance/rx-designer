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
  const cellSize = designerVars.cellSize;

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

      // label
      ctx.fillStyle = '#000';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.font = '500 6pt Roboto';
      ctx.fillText(input.name, pos.x + 2 * cellSize, pos.y + cellSize / 2);

      // circle
      // ctx.fillStyle = '#aaaae2';
      ctx.fillStyle = gl.props.hover ? '#f2f2f2' : '#aaaae2';
      ctx.arc(pos.x + cellSize / 2, pos.y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // ctx.beginPath();
      // if (conn) {
      //   ctx.strokeStyle = 'red';
      // } else {
      //   ctx.strokeStyle = gl.props.hover ? '#fff' : '#aaa';
      // }

      // if (conn && gl.props.hover) {
      //   paintX(ctx, pos, dim);
      // } else {
      //   ctx.arc(
      //     pos.x + dim.x / 2,
      //     pos.y + dim.y / 2,
      //     dim.x / 2 - 2,
      //     0,
      //     Math.PI * 2
      //   );
      // }

      // ctx.lineWidth = 2;
      // ctx.stroke();
      // ctx.closePath();
    },
  });
}

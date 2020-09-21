import { paintArrow } from '../paint/arrow';
import { glue } from 'src/app/glue';
import { ReactiveGraph } from '@cbsm-finance/reactive-nodes';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { designerVars } from '../designer-vars';

export function outPortGlue(
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
    // yPx: -((count - 1) * d) / 2 + d * i + parentHeight / 2 - height / 2,
    label: 'out-port',
    customPaint: (gl, ctx: CanvasRenderingContext2D) => {
      const { pos, dim } = gl.cache;
      const output = node.outputs[i];

      // label
      ctx.beginPath();
      ctx.fillStyle = '#000';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'right';
      ctx.font = 'medium 6pt Roboto';
      ctx.fillText(output.name, pos.x - 2 * cellSize, pos.y + cellSize / 2);
      ctx.closePath();

      // circle
      ctx.beginPath();
      ctx.fillStyle = gl.props.hover ? '#9999f2' : '#b2b2b2';
      ctx.arc(pos.x + cellSize / 2, pos.y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // paintArrow(ctx, pos, dim);
      // const conn = graph.outgoingNodes(node, i).length > 0;

      // if (conn) {
      //   ctx.strokeStyle = colors.connections;
      // } else {
      //   ctx.strokeStyle = gl.props.hover ? '#fff' : '#aaa';
      // }

      // paintArrow(ctx, pos, dim);

      // ctx.lineWidth = 2;
      // ctx.stroke();
    },
  });
}

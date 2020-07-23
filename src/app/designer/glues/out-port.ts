import { paintArrow } from '../paint/arrow';
import { glue } from 'src/app/glue';
import { ReactiveGraph, Node } from '@cbsm-finance/reactive-nodes';

export function outPortGlue(
  height: number,
  count: number,
  d: number,
  i: number,
  parentHeight: number,
  node: Node,
  colors: any,
  graph: ReactiveGraph,
) {
  return glue({
    wPc: 1,
    hPx: height,
    yPx: -((count - 1) * d) / 2 + d * i + parentHeight / 2 - height / 2,
    label: 'out-port',
    customPaint: (gl, ctx) => {
      const { pos, dim } = gl.cache;
      paintArrow(ctx, pos, dim);
      const conn = graph.outgoingNodes(node).length > 0;

      if (conn) {
        ctx.strokeStyle = colors.connections;
      } else {
        ctx.strokeStyle = gl.props.hover ? '#fff' : '#aaa';
      }

      paintArrow(ctx, pos, dim);

      ctx.lineWidth = 2;
      ctx.stroke();
    },
  });
}

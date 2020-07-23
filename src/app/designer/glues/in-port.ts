import { glue } from 'src/app/glue';
import { Node, ReactiveGraph } from '@cbsm-finance/reactive-nodes';
import { paintX } from '../paint/x';

export function inPortGlue(
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
    label: 'in-port',
    customPaint: (gl, ctx) => {
      const { pos, dim } = gl.cache;
      const conn = graph.incomingNode(node, i + 1);

      ctx.beginPath();

      if (conn) {
        ctx.strokeStyle = colors.connections;
      } else {
        ctx.strokeStyle = gl.props.hover ? '#fff' : '#aaa';
      }

      if (conn && gl.props.hover) {
        paintX(ctx, pos, dim);
      } else {
        ctx.arc(
          pos.x + dim.x / 2,
          pos.y + dim.y / 2,
          dim.x / 2 - 2,
          0,
          Math.PI * 2
        );
      }

      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    },
  });
}

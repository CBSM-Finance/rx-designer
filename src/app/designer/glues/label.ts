import { glue } from 'src/app/glue';
import { Node } from '@cbsm-finance/reactive-nodes';

export function labelGlue(node: Node, colors: any) {
  const height = 12;
  return glue({
    xPx: 0,
    yPx: -height,
    wPc: 1,
    hPx: height,
    customPaint: (gl, ctx) => {
      const pos = gl.center();
      ctx.beginPath();
      ctx.textAlign = 'center';
      ctx.fillStyle = colors.label;
      ctx.font = 'bold 8pt';
      ctx.fillText(node.name, pos.x, pos.y);
      ctx.closePath();
    },
  });
}

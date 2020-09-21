import { glue } from 'src/app/glue';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { designerVars } from '../designer-vars';

export function labelGlue(node: DesignerNode, colors: any) {
  const cellSize = designerVars.cellSize;
  return glue({
    xPx: 0,
    yPx: -cellSize * 3,
    wPc: 1,
    hPx: cellSize * 2,
    customPaint: (gl, ctx) => {
      const pos = gl.center();
      ctx.beginPath();
      ctx.textAlign = 'center';
      ctx.fillStyle = colors.label;
      ctx.font = 'bold 8pt Roboto';
      ctx.fillText(node.title, pos.x, pos.y);
      ctx.closePath();
    },
  });
}

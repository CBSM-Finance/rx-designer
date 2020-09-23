import { glue } from 'src/app/glue';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { designerVars } from '../designer-vars';

export function labelGlue(node: DesignerNode, colors: any) {
  const cellSize = designerVars.adjCellSize();
  const coreHeight = cellSize * 4;

  return glue({
    xPx: 0,
    yPx: coreHeight,
    wPc: 1,
    hPx: cellSize * 2,
    customPaint: (gl, ctx) => {
      if (!node.label) return void 0;
      const pos = gl.center();
      ctx.beginPath();
      ctx.textAlign = 'center';
      ctx.fillStyle = colors.label;
      ctx.font = `400 ${8 * designerVars.zoomFactor}pt Roboto`;
      ctx.fillText(node.label, pos.x, pos.y);
      ctx.closePath();
    },
  });
}

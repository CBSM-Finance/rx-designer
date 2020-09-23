import { glue } from 'src/app/glue';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { getGroup } from 'src/app/nodes/node-groups';
import { designerVars } from '../designer-vars';

export function titleGlue(node: DesignerNode) {
  const group = getGroup(node);
  const cellSize = designerVars.adjCellSize();

  return glue({
    xPx: 0,
    yPx: -cellSize * 2,
    wPc: 1,
    hPx: cellSize * 2,
    customPaint: (gl, ctx) => {
      const pos = gl.center();
      ctx.beginPath();
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';
      ctx.font = `700 ${7 * designerVars.zoomFactor}pt Roboto`;
      ctx.fillText(node.title, pos.x, pos.y);
      ctx.closePath();
    },
  });
}

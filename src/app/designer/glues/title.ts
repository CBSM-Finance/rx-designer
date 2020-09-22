import { glue } from 'src/app/glue';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { getGroup } from 'src/app/nodes/node-groups';
import { designerVars } from '../designer-vars';
import { roundedRect } from '../paint/rounded-rect';

export function titleGlue(node: DesignerNode, colors: any) {
  const group = getGroup(node);
  const cellSize = designerVars.cellSize;

  return glue({
    xPx: 0,
    yPx: 0,
    wPc: 1,
    hPx: cellSize * 2,
    customPaint: (gl, ctx) => {
      const { pos, dim } = gl.cache;
      const centerPos = gl.center();

      ctx.beginPath();
      // ctx.fillStyle = group.color;
      // ctx.fillStyle = '#eee';

      const grd = ctx.createLinearGradient(centerPos.x, pos.y, centerPos.x, pos.y + dim.y);
      grd.addColorStop(0, '#fff');
      // grd.addColorStop(.6, '#eee');
      grd.addColorStop(1, group.color);
      // Fill with gradient
      ctx.fillStyle = grd;

      const p = 1;
      roundedRect(ctx, pos.x + p, pos.y + p, dim.x - p * 2, dim.y - p * 2, cellSize);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#000';
      ctx.font = '500 6pt Roboto';
      ctx.fillText(node.title, pos.x + cellSize, pos.y + cellSize);
      ctx.closePath();
    },
  });
}

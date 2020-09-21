import { glue } from 'src/app/glue';
import { roundedRect } from '../paint/rounded-rect';
import { Designer } from '../designer';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { designerVars } from '../designer-vars';

export function coreGlue(designer: Designer, node: DesignerNode) {
  const s = designerVars.cellSize * 14;
  return glue({
    anchor: 'topLeft',
    xPx: 0,
    yPx: 0,
    wPc: 1,
    hPc: 1,
    label: 'core',
    customPaint: (gl, ctx) => {
      const { pos, dim } = gl.cache;

      ctx.save();
      ctx.fillStyle = 'rgba(232, 232, 232, .8)';
      // ctx.fillStyle = '#EFEFEF';
      ctx.shadowColor = '#dadada';

      if (designer.selectedNode === node) {
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#b8b8f8';
      } else {
        ctx.shadowBlur = gl.props.hover ? 8 : 0;
        ctx.strokeStyle = '#b8b8b8';
      }

      ctx.beginPath();
      roundedRect(ctx, pos.x, pos.y + .5, dim.x, dim.y, designerVars.cellSize);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    },
  });
}

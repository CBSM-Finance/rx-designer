import { glue } from 'src/app/glue';
import { roundedRect } from '../paint/rounded-rect';
import { Designer } from '../designer';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { designerVars } from '../designer-vars';

export function coreGlue(designer: Designer, node: DesignerNode) {
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
      ctx.fillStyle = 'rgba(255, 255, 255, .9)';
      ctx.shadowColor = '#dadada';

      if (designer.selectedNode === node) {
        ctx.lineWidth = 1;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#000678';
      } else {
        ctx.lineWidth = .5;
        ctx.shadowBlur = gl.props.hover ? 8 : 0;
        ctx.strokeStyle = '#ccc';
      }

      ctx.beginPath();
      roundedRect(ctx, pos.x, pos.y + .5, dim.x, dim.y, designerVars.adjCellSize());
      ctx.closePath();
      ctx.fill('evenodd');
      ctx.stroke();
      ctx.restore();
    },
  });
}

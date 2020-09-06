import { glue } from 'src/app/glue';
import { roundedRect } from '../paint/rounded-rect';
import { Designer } from '../designer';
import { DesignerNode } from 'src/app/nodes/designer-node';

export function coreGlue(designer: Designer, node: DesignerNode) {
  const s = designer.gridSize * 2;
  return glue({
    anchor: 'center',
    xPx: -s / 2,
    yPx: -s / 2,
    wPx: s,
    hPx: s,
    label: 'core',
    customPaint: (gl, ctx) => {
      const { pos, dim } = gl.cache;
      ctx.beginPath();
      ctx.strokeStyle = gl.props.hover ? '#aaa' : 'white';
      ctx.lineWidth = 1;

      roundedRect(ctx, pos.x, pos.y + 0.5, dim.x, dim.y, 2);
      ctx.closePath();
      ctx.fillStyle = designer.selectedNode === node ? '#aaa' : '#f2f244';
      ctx.stroke();
      ctx.fill();
    },
  });
}

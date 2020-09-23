import { glue } from 'src/app/glue';
import { roundedRect } from '../paint/rounded-rect';
import { Designer } from '../designer';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { designerVars } from '../designer-vars';
import { getGroup } from '../../nodes/node-groups';
import { connectedNodes } from '../../marbles/connected-nodes';

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
      const center = gl.center();

      const group = getGroup(node);
      const isConnected = connectedNodes(designer.graph).includes(node);

      ctx.save();
      // ctx.fillStyle = lightenColor(group.color, 99.9);
      ctx.fillStyle = '#fafafa';
      // ctx.fillStyle = 'rgba(255, 255, 255, .9)';
      ctx.shadowColor = '#dadada';

      if (designer.selectedNode === node) {
        ctx.lineWidth = 1 * designerVars.zoomFactor;
        ctx.shadowBlur = 8 * designerVars.zoomFactor;
        ctx.strokeStyle = '#000678';
      } else {
        ctx.lineWidth = 1 * designerVars.zoomFactor;
        ctx.shadowBlur = (gl.props.hover ? 8 : 0) * designerVars.zoomFactor;
        ctx.strokeStyle = '#ccc';
      }

      ctx.beginPath();
      // ctx.fillRect(pos.x, pos.y + .5, dim.x, dim.y);
      // ctx.strokeRect(pos.x, pos.y + .5, dim.x, dim.y);
      roundedRect(
        ctx,
        pos.x,
        pos.y + 0.5,
        dim.x,
        dim.y,
        designerVars.adjCellSize()
      );
      ctx.closePath();
      ctx.fill('evenodd');
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = isConnected ? group.color : '#ddd';
      ctx.font = '18pt material-icons';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(group.icon, center.x, center.y);
    },
  });
}

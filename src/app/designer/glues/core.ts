import { glue } from 'src/app/glue';
import { roundedRect } from '../paint/rounded-rect';
import { Designer } from '../designer';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { designerVars } from '../designer-vars';
import { getGroup } from '../../nodes/node-groups';
import { connectedNodes } from '../../marbles/connected-nodes';
import { colors, design } from '../colors';

const borderWidth = 2;

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

      const { hover } = gl.props;
      const nodeGroup = getGroup(node);
      const isConnected = connectedNodes(designer.graph).includes(node);

      ctx.save();
      ctx.fillStyle = isConnected ? colors.core.bgConnected : colors.core.bgDisconnected;
      ctx.strokeStyle = hover ? colors.core.borderHover : colors.core.border;

      if (designer.selectedNode === node) {
        ctx.lineWidth = 1 * designerVars.zoomFactor;
      } else {
        ctx.lineWidth = 1 * designerVars.zoomFactor;
      }

      ctx.beginPath();
      roundedRect(
        ctx,
        pos.x,
        pos.y + 0.5,
        dim.x,
        dim.y,
        designerVars.adjCellSize() * design.cornerRadius,
      );
      ctx.closePath();
      ctx.fill();

      ctx.lineWidth = borderWidth;
      ctx.stroke();
      ctx.restore();
    },
  });
}

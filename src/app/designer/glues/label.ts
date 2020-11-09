import { glue } from 'src/app/glue';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { colors, design } from '../colors';
import { designerVars } from '../designer-vars';
import { roundedRect } from '../paint/rounded-rect';
import { GlueFactory } from './glue-factory';

export type LabelGlueFactoryOpts = { node: DesignerNode };

export const labelGlue: GlueFactory<LabelGlueFactoryOpts> = (designer, { node }) => {
  const cellSize = designerVars.adjCellSize();
  const gridSize = cellSize * 2;
  const coreHeight = designer.coreHeight(node);

  return glue({
    xPx: 0,
    yPx: coreHeight + cellSize,
    wPc: 1,
    hPx: gridSize,
    customPaint: (gl, ctx) => {
      if (!node.label) return void 0;

      const { pos, dim } = gl.cache;

      // background
      ctx.beginPath();
      ctx.fillStyle = colors.label.bg;
      roundedRect(
        ctx,
        pos.x,
        pos.y,
        dim.x,
        dim.y,
        designerVars.adjCellSize() * design.cornerRadius,
      );
      ctx.closePath();
      ctx.fill();

      const center = gl.center();
      ctx.beginPath();
      ctx.textAlign = 'center';
      ctx.fillStyle = colors.label.text;
      ctx.font = `400 ${8 * designerVars.zoomFactor}pt Roboto`;
      ctx.fillText(node.label, center.x, pos.y + cellSize);
      ctx.closePath();
    },
  });
}

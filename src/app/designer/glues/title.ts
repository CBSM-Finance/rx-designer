import { glue } from 'src/app/glue';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { getGroup } from 'src/app/nodes/node-groups';
import { colors } from '../colors';
import { designerVars } from '../designer-vars';
import { GlueFactory } from './glue-factory';

type TitleGlueFactoryOpts = { node: DesignerNode };

export const titleGlue: GlueFactory<TitleGlueFactoryOpts> = (designer, { node }) => {
  const group = getGroup(node);
  const cellSize = designerVars.adjCellSize();

  return glue({
    xPx: 0,
    yPx: -cellSize * 2,
    wPc: 1,
    hPx: cellSize * 2,
    // color: 'red',
    customPaint: (gl, ctx) => {
      const { pos } = gl.cache;
      ctx.beginPath();
      ctx.textAlign = 'left';
      ctx.fillStyle = colors.title;
      ctx.font = `500 ${8 * designerVars.zoomFactor}pt Roboto`;
      ctx.fillText(node.title, pos.x, pos.y + cellSize);
      ctx.closePath();
    },
  });
}

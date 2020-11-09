import { Glue, glue, GlueCustomPaint } from 'src/app/glue';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { designerVars } from '../designer-vars';
import { roundedRect } from '../paint/rounded-rect';
import { GlueFactory } from './glue-factory';
import { colors, design } from '../colors';

const borderWidth = 1;

type OutPortsFactoryOpts = { node: DesignerNode };

export const outPortsGlue: GlueFactory<OutPortsFactoryOpts> = (designer, { node }) => {
  const cellSize = designerVars.adjCellSize();
  const count = node.outputs.length;

  const items = Array.from(Array(count))
    .map((_, i) => i * cellSize * 2)
    .map((y, i) => outPortGlue(designer, { y, i, node, cellSize }) as Glue);

  const offsetY = node.inputs.length * cellSize * 2 + cellSize;

  return glue(
    {
      hPc: 1,
      wPc: 1,
      xPx: 0,
      yPx: offsetY,
      anchor: 'topLeft',
      customPaint: (gl, ctx) => {
        const { dim, pos } = gl.cache;
        ctx.beginPath();
        ctx.fillStyle = colors.ports.separator;
        ctx.fillRect(pos.x, pos.y - cellSize / 2 - borderWidth / 2, dim.x, borderWidth);
        ctx.closePath();
      }
    },
    items,
  );
};

type OutPortFactoryOpts = { node: DesignerNode, y: number, i: number, cellSize: number };

export const outPortGlue: GlueFactory<OutPortFactoryOpts> = ({ graph }, { y, i, node, cellSize }) => {
  return glue({
    wPx: cellSize * 2,
    hPx: cellSize * 2,
    yPx: y,
    xPx: -cellSize * 2,
    label: 'out-port',
    anchor: 'topRight',
    customPaint: (gl, ctx) => {
      const { pos } = gl.cache;
      const connected = graph.outgoingNodes(node, i).length > 0;
      const output = node.outputs[i];
      const { hover } = gl.props;

      // label
      ctx.beginPath();
      ctx.fillStyle = connected ? colors.connections : colors.ports.disconnected;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'right';
      ctx.font = `400 ${8 * designerVars.zoomFactor}pt Roboto`;
      ctx.fillText(output.name, pos.x, pos.y + cellSize);
      ctx.closePath();

      // rect
      ctx.beginPath();
      ctx.fillStyle = connected ? colors.ports.connected : colors.ports.disconnected;
      roundedRect(
        ctx,
        pos.x + cellSize / 2,
        pos.y + cellSize / 2,
        cellSize,
        cellSize,
        designerVars.adjCellSize() * design.cornerRadius,
      );
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.fillStyle = connected ? colors.connections : colors.core.bgConnected;
      roundedRect(
        ctx,
        pos.x + cellSize * .75,
        pos.y + cellSize * .75,
        cellSize / 2,
        cellSize / 2,
        designerVars.adjCellSize() * design.cornerRadius,
      );
      ctx.fill();
      ctx.closePath();

      if (hover) {
        ctx.fillStyle = 'rgba(0, 0, 0, .2)';
        ctx.fill();
      }

      // arrow
      // paintArrow(ctx, {
      //   x: pos.x + cellSize / 2,
      //   y: pos.y + cellSize / 2,
      // }, {
      //   x: cellSize,
      //   y: cellSize,
      // });
      // ctx.strokeStyle = colors.ports.connected;
      // ctx.stroke();
    },
  });
};



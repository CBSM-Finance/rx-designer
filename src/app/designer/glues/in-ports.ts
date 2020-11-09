import { Glue, glue, GlueCustomPaint } from 'src/app/glue';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { designerVars } from '../designer-vars';
import { roundedRect } from '../paint/rounded-rect';
import { GlueFactory } from './glue-factory';
import { colors, design } from '../colors';

type InPortsFactoryOpts = { node: DesignerNode };

export const inPortsGlue: GlueFactory<InPortsFactoryOpts> = (designer, { node }) => {
  const cellSize = designerVars.adjCellSize();
  const count = node.inputs.length;

  const offsetY = 0;

  const items = Array.from(Array(count))
    .map((_, i) => offsetY + i * cellSize * 2)
    .map((y, i) => inPortGlue(designer, { y, i, node, cellSize }) as Glue);

  return glue(
    {
      hPc: 1,
      wPc: 1,
      xPx: 0,
      color: 'transparent',
    },
    items,
  );
};

type InPortFactoryOpts = { node: DesignerNode, y: number, i: number, cellSize: number };

export const inPortGlue: GlueFactory<InPortFactoryOpts> = ({ graph }, { y, i, node, cellSize }) => {
  return glue({
    wPc: 1,
    hPx: cellSize * 2,
    yPx: y,
    xPx: 0,
    label: 'in-port',
    anchor: 'topLeft',
    customPaint: (gl, ctx) => {
      const { pos, dim } = gl.cache;
      const connected = graph.incomingNode(node, i);
      const input = node.inputs[i];
      const { hover } = gl.props;

      // label
      ctx.beginPath();
      ctx.fillStyle = connected ? colors.connections : colors.ports.disconnected;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.font = `400 ${8 * designerVars.zoomFactor}pt Roboto`;
      ctx.fillText(input.name, pos.x + cellSize * 2, pos.y + cellSize);
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
    },
  });
};

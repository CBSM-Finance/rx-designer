import { subtract, glue } from 'src/app/glue';
import { colors } from '../colors';
import { designerVars } from '../designer-vars';
import { GlueFactory } from './glue-factory';

type ConnectionsGlueFactoryOpts = {};

const connWidth = 2;

export const connectionsGlue: GlueFactory<ConnectionsGlueFactoryOpts> = designer => {
  const { connections, glNodes } = designer;

  return connections.map(({ source, target, inPort, outPort }) => {
    const a = glNodes[source].query('out-port')[outPort].centerRight();
    const b = glNodes[target].query('in-port')[inPort].centerLeft();
    const boundingBox = subtract(b, a);
    return glue({
      xPx: a.x,
      yPx: a.y,
      wPx: boundingBox.x,
      hPx: boundingBox.y,
      asLine: true,
      customPaint: (gl, ctx) => {
        const { pos, dim } = gl.cache;
        const offset = 0;

        ctx.beginPath();
        ctx.strokeStyle = colors.connections;
        ctx.lineWidth = connWidth * designerVars.zoomFactor;
        ctx.moveTo(pos.x + offset, pos.y);
        const toX = pos.x + dim.x - offset;
        const toY = pos.y + dim.y;
        const delta = Math.sqrt(
          Math.pow(pos.x - toX, 2) + Math.pow(pos.y - toY, 2),
        );
        const smoothing = delta * 0.1;
        ctx.bezierCurveTo(
          pos.x + smoothing + offset,
          pos.y,
          toX - smoothing,
          toY,
          toX,
          toY,
        );
        ctx.stroke();
        ctx.closePath();
      },
    });
  });
};

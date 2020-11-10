import { glue, Glue } from 'src/app/glue';
import { DesignerNode } from 'src/app/nodes/designer-node';
import { coreHeight } from '../core-height';
import { designerVars } from '../designer-vars';
import { coreGlue } from './core';
import { GlueFactory } from './glue-factory';
import { inPortsGlue } from './in-ports';
import { labelGlue } from './label';
import { outPortsGlue } from './out-ports';
import { titleGlue } from './title';

export type NodeGlueFactoryOpts = { x: number; y: number; node: DesignerNode };

export const nodeGlue: GlueFactory<NodeGlueFactoryOpts> = (
  designer,
  { x, y, node },
) => {
  const gridSize = designerVars.adjCellSize();
  const height = coreHeight(node);

  const gl = glue(
    {
      wPx: gridSize * 12,
      hPx: height,
      xPx: x,
      yPx: y,
      snapToGrid: { x: void 0, y: gridSize },
      color: 'transparent',
    },
    [
      coreGlue(designer, node),
      inPortsGlue(designer, { node }) as Glue,
      outPortsGlue(designer, { node }) as Glue,
      labelGlue(designer, { node }) as Glue,
      titleGlue(designer, { node }) as Glue,
    ],
  );
  return gl;
};

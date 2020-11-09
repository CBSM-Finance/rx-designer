import { DesignerNode } from '../nodes/designer-node';
import { designerVars } from './designer-vars';

export function coreHeight(node: DesignerNode): number {
  const cellSize = designerVars.adjCellSize();
  return ((node.inputs.length + node.outputs.length) * 2 + 1) * cellSize;
}

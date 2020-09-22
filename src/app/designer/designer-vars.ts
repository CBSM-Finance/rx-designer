import { number } from 'mathjs';

export const designerVars = {
  cellSize: 8,
  zoomFactor: 1,
  translate: { x: 0, y: 0 },
  adjCellSize: () => designerVars.cellSize * designerVars.zoomFactor,
};

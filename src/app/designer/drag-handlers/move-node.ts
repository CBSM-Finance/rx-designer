import { Designer } from '../designer';
import { designerVars } from '../designer-vars';

export class MoveNodeDragHandler {
  reload() {
    const { dh, glNodes, positions } = this.designer;

    glNodes.forEach((gl, i) => {
      dh.register(
        gl,
        {
          setRef: dg => dg.path[0],
          onMove: ({ glue, startOffset, delta }) => {
            const props = glue.props;
            props.xOffsetPx = startOffset.x + delta.x;
            props.yOffsetPx = startOffset.y + delta.y;

            // update pos in source data
            const nodeIndex = glNodes.indexOf(glue);
            positions[nodeIndex] = [
              (props.xPx + props.xOffsetPx) / designerVars.zoomFactor,
              (props.yPx + props.yOffsetPx) / designerVars.zoomFactor,
            ];
          },
        },
        'core',
      );
    });
  }

  constructor(private designer: Designer) {}
}

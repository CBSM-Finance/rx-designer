import { Designer } from '../designer';

export class SelectNodeMouseHandler {
  reload() {
    const { mh, glNodes, graph } = this.designer;
    glNodes.forEach((gl, i) => {
      mh.register(gl.query('core')[0], {
        onClick: () => (this.designer.selectedNode = graph.nodes[i]),
      });
    });
  }

  constructor(private designer: Designer) {}
}

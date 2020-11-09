import { Designer } from '../designer';

export class DisconnectPortMouseHandler {
  reload() {
    const { mh, glNodes, graph } = this.designer;
    glNodes.forEach((gl, i) => {
      gl.query('in-port-symbol').forEach((port, inPort) => {
        mh.register(port, {
          onClick: () => {
            const nodes = graph.nodes;
            const incomingNode = graph.incomingNode(nodes[i], inPort);
            if (!incomingNode) return false;
            graph.disconnect(incomingNode, nodes[i], inPort);
            this.designer.getConnections();
          },
        });
      });
    });
  }

  constructor(private designer: Designer) {}
}

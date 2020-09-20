import { DesignerNode } from '../nodes/designer-node';
import { ReactiveGraph } from '@cbsm-finance/reactive-nodes';

export function connectedNodes({ edges, nodes }: ReactiveGraph<DesignerNode>): DesignerNode[] {
  const connectorId = 'connector';
  const connectorIndex = nodes.findIndex(node => node.localId === connectorId);
  const connNodeIndexes = [connectorIndex];
  let found: boolean;

  do {
    found = false;
    for (let i = 0; i < nodes.length; i++) {
      if (connNodeIndexes.includes(i)) continue;
      const nodeConns = edges[i];
      if (!nodeConns.find((conns, h) => conns !== 0 && conns.length > 0 && connNodeIndexes.includes(h))) continue;
      found = true;
      connNodeIndexes.push(i);
    }
  } while (found);

  return connNodeIndexes.map(index => nodes[index]).reverse();
}

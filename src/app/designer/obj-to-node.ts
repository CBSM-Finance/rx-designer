import { DesignerNode } from '../nodes/designer-node';
import { nodeGroups } from '../nodes/node-groups';

export function objToNode(obj: any): DesignerNode {
  const [groupId, nodeId] = obj.type.split('.');
  const group = nodeGroups.find(g => g.id === groupId);

  if (!group) throw new Error(`Group '${groupId}' could not be found.`);

  const node = group.nodes.find(n => n.LOCAL_ID === nodeId) as any;
  if (!node) throw new Error(`Node '${nodeId}' in group '${groupId}' could not be found.`);

  const instance = new node();
  instance.inputs = obj.inputs;

  return instance;
}

export function nodeToObj(node: DesignerNode): any {
  const obj = {
    type: `${node.groupId}.${node.localId}`,
    inputs: node.inputs,
  };
  return obj;
}

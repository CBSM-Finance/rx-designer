import { DesignerNode } from '../nodes/designer-node';
import { nodeGroups } from '../nodes/node-groups';

export function objToNode(obj: any): DesignerNode {
  const [groupId, nodeId] = obj.type.split('.');
  const group = nodeGroups.find(g => g.id === groupId);

  if (!group) throw new Error(`Group '${groupId}' could not be found.`);

  const node = group.nodes.find(n => n.LOCAL_ID === nodeId) as any;
  if (!node) throw new Error(`Node '${nodeId}' in group '${groupId}' could not be found.`);

  // add params...... 88888888888888888888

  return new node();
}

// abstract class Person {
//   name: string;
// }

// class Employee extends Person {
// }

// const persons: typeof Person[] = [Employee];

// const dan = new persons[0](); // Cannot create an instance of an abstract class.

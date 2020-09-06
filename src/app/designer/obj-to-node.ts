import { DesignerNode } from '../nodes/designer-node';
import { EmptyNode } from '../nodes/empty-node';
import { LaunchIBNode } from '../nodes/ib/launch-ib.node';
import { JSONReaderNode } from '../nodes/json-reader-node';
import { MktDataNode } from '../nodes/mkt-data-node';

export function objToNode(obj: any, scope: any): DesignerNode {
  const args = obj.options || [];
  switch (obj.type) {
    case 'empty':
      return new EmptyNode();
    case 'launchIb':
      return new LaunchIBNode();
    // case 'number':
    //   return new NumberNode(...args);
    // case 'string':
    //   return new StringNode(...args);
    // case 'mean':
    //   return new MeanNode();
    // case 'print':
    //   return new PrintNode();
    case 'mktData':
      return new MktDataNode(scope);
    case 'jsonReader':
      return new JSONReaderNode();
  }
  throw new Error(`Type '${obj.type}' could not be found.`);
}

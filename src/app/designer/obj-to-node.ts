import { NumberNode, StringNode, MeanNode, PrintNode, Node } from '@cbsm-finance/reactive-nodes';
import { EmptyNode } from './nodes/empty-node';
import { MktDataNode } from './nodes/mkt-data-node';
import { JSONReaderNode } from './nodes/json-reader-node';

export function objToNode(obj: any, scope: any): Node {
  const args = obj.options || [];
  switch (obj.type) {
    case 'empty':
      return new EmptyNode();
    case 'number':
      return new NumberNode(...args);
    case 'string':
      return new StringNode(...args);
    case 'mean':
      return new MeanNode();
    case 'print':
      return new PrintNode();
    case 'mktData':
      return new MktDataNode(scope);
    case 'jsonReader':
      return new JSONReaderNode();
  }
  throw new Error(`Type '${obj.type}' could not be found.`);
}

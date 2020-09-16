import { DesignerNode } from './designer-node';
import { TextNode } from './text.node';
import { MergeNode } from './merge.node';
import { PrintNode } from './print.node';
import { ConnectorNode } from './connector.node';

export const nodeGroups: NodeGroup[] = [
  {
    title: 'System',
    id: 'system',
    nodes: [TextNode, MergeNode, PrintNode, ConnectorNode],
  },
  // {
  //   title: 'Interactive Brokers',
  //   id: 'ib',
  //   nodes: [ConnectTWSNode, LaunchIBNode, IBMessageNode],
  // },
];

export interface NodeGroup {
  readonly title: string;
  readonly id: string;
  readonly nodes: typeof DesignerNode[];
}

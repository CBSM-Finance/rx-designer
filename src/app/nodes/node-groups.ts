import { DesignerNode } from './designer-node';
import { TextNode } from './text.node';
import { MergeNode } from './merge.node';
import { PrintNode } from './print.node';
import { ConnectorNode } from './connector.node';
import { NumberNode } from './number.node';
import { IsEvenNode } from './is-even.node';
import { LaunchIBNode } from './ib/launch-ib.node';
import { ConnectTWSNode } from './ib/connect-tws.node';

export const nodeGroups: NodeGroup[] = [
  {
    title: 'System',
    id: 'system',
    nodes: [TextNode, MergeNode, PrintNode, ConnectorNode, NumberNode, IsEvenNode],
  },
  {
    title: 'Interactive Brokers',
    id: 'ib',
    nodes: [ConnectTWSNode, LaunchIBNode],
  },
];

export interface NodeGroup {
  readonly title: string;
  readonly id: string;
  readonly nodes: typeof DesignerNode[];
}

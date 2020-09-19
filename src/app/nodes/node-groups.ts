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
    color: '#f2f244',
    nodes: [TextNode, MergeNode, PrintNode, ConnectorNode, NumberNode, IsEvenNode],
  },
  {
    title: 'Interactive Brokers',
    id: 'ib',
    color: '#D81222',
    nodes: [ConnectTWSNode, LaunchIBNode],
  },
];

export interface NodeGroup {
  readonly title: string;
  readonly id: string;
  readonly color: string;
  readonly nodes: typeof DesignerNode[];
}

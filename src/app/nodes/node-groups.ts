import { DesignerNode } from './designer-node';
import { TextNode } from './text.node';
import { MergeNode } from './merge.node';
import { PrintNode } from './print.node';
import { ConnectorNode } from './connector.node';
import { NumberNode } from './number.node';
import { IsEvenNode } from './is-even.node';
import { LaunchIBNode } from './ib/launch-ib.node';
import { ConnectTWSNode } from './ib/connect-tws.node';
import { IfNode } from './math/if.node';
import { RequestMktDataNode } from './ib/request-mkt-data.node';
import { CronSchedulerNode } from './scheduling/cron-scheduler.node';

export const nodeGroups: NodeGroup[] = [
  {
    title: 'System',
    id: 'system',
    color: '#e2d244',
    icon: 'settings',
    nodes: [TextNode, MergeNode, PrintNode, ConnectorNode, NumberNode, IsEvenNode],
  },
  {
    title: 'Math',
    id: 'math',
    color: '#1288a2',
    icon: 'functions',
    nodes: [IfNode],
  },
  {
    title: 'Interactive Brokers',
    id: 'ib',
    color: '#D81222',
    icon: 'analytics',
    nodes: [ConnectTWSNode, LaunchIBNode, RequestMktDataNode],
  },
  {
    title: 'Scheduling',
    id: 'scheduling',
    color: '#888',
    icon: 'alarm',
    nodes: [CronSchedulerNode],
  },
];

export interface NodeGroup {
  readonly title: string;
  readonly id: string;
  readonly color: string;
  readonly icon: string;
  readonly nodes: typeof DesignerNode[];
}

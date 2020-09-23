import { DesignerNode } from './designer-node';
import { TextNode } from './text.node';
import { MergeNode } from './rx/merge.node';
import { PrintNode } from './print.node';
import { ConnectorNode } from './connector.node';
import { NumberNode } from './math/number.node';
import { IsEvenNode } from './math/is-even.node';
import { LaunchIBNode } from './ib/launch-ib.node';
import { ConnectTWSNode } from './ib/connect-tws.node';
import { IfNode } from './math/if.node';
import { RequestMktDataNode } from './ib/request-mkt-data.node';
import { CronSchedulerNode } from './scheduling/cron-scheduler.node';
import { ContractNode } from './ib/contract.node';
import { RequireMktDataNode } from './ib/require-mkt-data.node';
import { CombineLatestNode } from './rx/combine-latest.node';
import { TransmitOrderNode } from './ib/transmit-order.node';
import { PluckNode } from './rx/pluck.node';
import { MapToNode } from './rx/map-to.node';
import { MultiplyNode } from './math/multiply.node';
import { TakeNode } from './rx/take.node';

export const nodeGroups: NodeGroup[] = [
  {
    title: 'System',
    id: 'system',
    color: '#e2d244',
    icon: 'trip_origin',
    nodes: [TextNode, PrintNode, ConnectorNode],
  },
  {
    title: 'RX',
    id: 'rx',
    color: '#89008E',
    icon: 'local_fire_department',
    nodes: [MergeNode, CombineLatestNode, PluckNode, MapToNode, TakeNode],
  },
  {
    title: 'Math',
    id: 'math',
    color: '#1288a2',
    icon: 'functions',
    nodes: [IfNode, MultiplyNode, NumberNode, IsEvenNode],
  },
  {
    title: 'Interactive Brokers',
    id: 'ib',
    color: '#D81222',
    icon: 'analytics',
    nodes: [ConnectTWSNode, LaunchIBNode, RequestMktDataNode, ContractNode, RequireMktDataNode, TransmitOrderNode],
  },
  {
    title: 'Scheduling',
    id: 'scheduling',
    color: '#888',
    icon: 'alarm',
    nodes: [CronSchedulerNode],
  },
];

export function getGroup(node: DesignerNode): NodeGroup {
  return nodeGroups.find(group => group.id === node.groupId);
}

export interface NodeGroup {
  readonly title: string;
  readonly id: string;
  readonly color: string;
  readonly icon: string;
  readonly nodes: typeof DesignerNode[];
}

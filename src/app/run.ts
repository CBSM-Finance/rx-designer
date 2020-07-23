import {
  ReactiveGraph,
  NumberNode,
  MeanNode,
  PrintNode,
  Node,
} from "@cbsm-finance/reactive-nodes";

const nodes: Node[] = [
  new NumberNode(20),
  new NumberNode(40),
  new NumberNode(80),
  new MeanNode(),
  new PrintNode(), // 46.6666
];

const edges = [
  [0, 0, 0, 1, 0],
  [0, 0, 0, 2, 0],
  [0, 0, 0, 3, 0],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0],
];

const graph = new ReactiveGraph(nodes, edges);

export function run() {
  const node = graph.nodes[4];
  graph.execute(node);
  graph.removeNode(graph.nodes[0]);
  graph.execute(node);
}

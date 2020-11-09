import { NodeBuilder, ReactiveGraph } from '@cbsm-finance/reactive-nodes';
import { asapScheduler, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { map, observeOn, tap, withLatestFrom } from 'rxjs/operators';
import { MarblesService } from '../marbles/marbles.service';
import { DesignerNode } from '../nodes/designer-node';

/**
 * Custom node builder for RX Designer.
 */
export const rxDesignerNodeBuilder = (ms: MarblesService): NodeBuilder => (
  node: DesignerNode,
  inputs,
  graph: ReactiveGraph<DesignerNode>
) => {

  // the final observables of the inputs
  const inputObservables = inputs
    .map((input, i: number) => {
      const { required, value } = node.inputs[i];
      const connected = input !== EMPTY;
      const hasValue = value !== void 0;
      return connected ? input : of((required || hasValue) ? value : void 0);
    });

  // group into combineLatest and withLatestFrom
  const groupedInputs = arrayToTwoGroups<Observable<any>>(inputObservables, (input, i: number) => {
    const { required, emit } = node.inputs[i];
    const connected = input !== EMPTY;
    return connected ? emit : required;
  });

  const inputValues = combineLatest(groupedInputs.groupA).pipe(
    withLatestFrom(groupedInputs.groupB),
    map(([cL, ...wLF]) => groupedInputs.revert(cL, wLF)),
  );

  return (node.connect(inputValues) as Observable<any>[]).map((output, i) =>
    output.pipe(
      observeOn(asapScheduler),
      tap((data) => ms.nodeOutput(node, node.outputs[i], data, graph))
    ),
  );
};

export function arrayToTwoGroups<T>(
  items: T[],
  group: (item: T, index: number) => boolean,
) {
  const groupA = items.filter((item, index: number) => group(item, index));
  const groupB = items.filter((item, index: number) => !group(item, index));

  return {
    groupA,
    groupB,
    revert: (targetGroupA: any[], targetGroupB: any[]) => {
      const arr = [];
      targetGroupA.forEach((item, i) => {
        const index = items.indexOf(groupA[i]);
        arr[index] = item;
      });
      targetGroupB.forEach((item, i) => {
        const index = items.indexOf(groupB[i]);
        arr[index] = item;
      });
      return arr;
    }
  };
}

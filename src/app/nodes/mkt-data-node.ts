import { BaseNode } from '@cbsm-finance/reactive-nodes';
import { Observable, merge } from 'rxjs';
import { map, switchMap, scan } from 'rxjs/operators';
import { State } from '../state';
import { DesignerNode, DesignerNodeArgType } from './designer-node';

export class MktDataNode implements DesignerNode {
  name = 'Market Data';
  args = [
    {
      name: 'Contracts',
      type: DesignerNodeArgType.ARRAY,
      required: false,
      description: 'A list of contracts to get the market data from.',
      value: [],
    },
  ];
  description = 'Market Data';

  operator(source: Observable<any>) {
    return source.pipe(
      map(([{ contracts }]) => ({ contracts })),
      switchMap(({ contracts }) =>
        merge(...contracts.map((contract) => this.scope.reqMktData(contract)))
      ),
      scan(
        (acc, data: any) => ({
          ...acc,
          [data.symbol]: { ...(acc[data.symbol] || {}), ...data },
        }),
        {}
      )
    );
  }

  constructor(private scope: any) {}
  state: any;
  connect: (state: State) => any;
  disconnect: () => any;
}

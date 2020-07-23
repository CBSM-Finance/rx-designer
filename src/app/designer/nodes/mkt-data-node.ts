import { BaseNode } from '@cbsm-finance/reactive-nodes';
import { Observable, merge } from 'rxjs';
import { map, switchMap, scan } from 'rxjs/operators';

export class MktDataNode extends BaseNode {
  requiredArgs = 1;

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

  constructor(private scope: any) {
    super('Market Data');
  }
}

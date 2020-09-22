import { DesignerNode } from '../designer-node';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

export class ContractNode extends DesignerNode {
  static TITLE = 'Contract';
  static LOCAL_ID = 'contract';
  static GROUP_ID = 'ib';

  description = `Interactive Brokers contract definition.`;

  inputs = [
    {
      name: 'Symbol',
      value: 'UVXY',
      type: 'string',
    },
    {
      name: 'Currency',
      value: 'USD',
    },
    {
      name: 'Exchange',
      value: 'SMART',
    },
    {
      name: 'Security Type',
      value: 'STK',
    },
  ];

  outputs = [
    {
      name: 'Contract',
    },
  ];

  connect(inputs: Observable<any>[]): Observable<any>[] {
    const contract = combineLatest(inputs).pipe(
      map(([, symbol, currency, exchange, secType]) => ({
        symbol,
        currency,
        exchange,
        secType,
      })),
    );
    return [contract];
  }
}

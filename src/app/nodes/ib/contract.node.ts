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
      required: true,
    },
    {
      name: 'Currency',
      value: 'USD',
      required: true,
    },
    {
      name: 'Exchange',
      value: 'SMART',
      required: true,
    },
    {
      name: 'Security Type',
      value: 'STK',
      required: true,
    },
    {
      name: 'Last Trade Date or Contract Month',
      required: false,
    },
  ];

  outputs = [
    {
      name: 'Contract',
    },
  ];

  connect(inputs: Observable<any>): Observable<any>[] {
    const contract = inputs.pipe(
      map(([symbol, currency, exchange, secType, lastTradeDateOrContractMonth]) => ({
        symbol,
        currency,
        exchange,
        secType,
        lastTradeDateOrContractMonth,
      })),
    );
    return [contract];
  }
}

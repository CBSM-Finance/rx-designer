import { DesignerNode } from '../designer-node';
import { filter, map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

export class RequireMktDataNode extends DesignerNode {
  static TITLE = 'Require Mkt Data';
  static LOCAL_ID = 'requireMktData';
  static GROUP_ID = 'ib';

  description = `Require certain fields of market data.`;

  inputs = [
    {
      name: 'Market Data',
      type: 'object',
    },
    {
      name: 'Required Fields',
      type: 'list',
    }
  ];

  outputs = [
    {
      name: 'Market Data',
      type: 'object',
    },
  ];

  connect(inputs: Observable<any>): Observable<any>[] {
    // const mktData = combineLatest(inputs).pipe(
    //   filter(([data, fields]) => true),
    //   map(([data]) => data),
    // );
    // return [mktData];
    return [];
  }
}

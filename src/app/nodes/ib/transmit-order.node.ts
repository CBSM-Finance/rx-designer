import { DesignerNode } from '../designer-node';
import { filter, map, tap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

export class TransmitOrderNode extends DesignerNode {
  static TITLE = 'Transmit Order';
  static LOCAL_ID = 'transmitOrder';
  static GROUP_ID = 'ib';

  description = ``;

  inputs = [
    {
      name: 'Impulse',
      type: 'impulse',
    },
    {
      name: 'Contract',
      type: 'object',
    },
    {
      name: 'Quantity',
      type: 'number',
    }
  ];

  outputs = [
    {
      name: 'Order Status',
      type: 'string',
    },
  ];

  connect(inputs: Observable<any>[]): Observable<any>[] {
    const transmit = combineLatest(inputs).pipe(
      tap(() => console.log('transmit order')),
    );
    return [transmit];
  }
}

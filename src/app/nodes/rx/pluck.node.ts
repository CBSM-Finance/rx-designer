import { Observable, merge, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DesignerNode } from '../designer-node';

export class PluckNode extends DesignerNode {
  static TITLE = 'Pluck';
  static LOCAL_ID = 'pluck';
  static GROUP_ID = 'rx';

  inputs = [
    {
      name: 'Object',
      type: 'object',
    },
    {
      name: 'Key',
      string: 'string',
    },
  ];

  outputs = [
    {
      name: 'Value',
    },
  ];

  connect(inputs: Observable<any>[]) {
    const plucked = combineLatest(inputs).pipe(
      map(([obj, key]) => obj[key]),
    );
    return [plucked];
  }
}

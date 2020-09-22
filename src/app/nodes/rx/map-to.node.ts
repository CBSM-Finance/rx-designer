import { Observable, merge } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { DesignerNode } from '../designer-node';

export class MapToNode extends DesignerNode {
  static TITLE = 'Map To';
  static LOCAL_ID = 'mapTo';
  static GROUP_ID = 'rx';

  inputs = [
    {
      name: 'Impulse',
      type: 'impulse',
    },
    {
      name: 'Value',
    },
  ];

  outputs = [
    {
      name: 'Value',
    },
  ];

  connect(inputs: Observable<any>[]) {
    return [inputs[0].pipe(
      withLatestFrom(inputs[1]),
      map(([, value]) => value),
    )];
  }
}

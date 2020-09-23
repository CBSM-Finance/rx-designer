import { Observable } from 'rxjs';
import { first, switchMap, take, tap } from 'rxjs/operators';
import { DesignerNode } from '../designer-node';

export class TakeNode extends DesignerNode {
  static TITLE = 'Take';
  static LOCAL_ID = 'take';
  static GROUP_ID = 'rx';

  inputs = [
    {
      name: 'Impulse',
      type: 'impulse',
    },
    {
      name: 'Count',
      string: 'number',
    },
  ];

  outputs = [
    {
      name: 'Last',
    },
  ];

  connect(inputs: Observable<any>[]) {
    const taken = inputs[1].pipe(
      first(),
      switchMap((count: string) => inputs[0].pipe(take(parseInt(count, 10)))),
    );
    return [taken];
  }
}

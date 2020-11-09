import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DesignerNode } from '../designer-node';

export class MultiplyNode extends DesignerNode {
  static TITLE = 'Multiply';
  static LOCAL_ID = 'multiply';
  static GROUP_ID = 'math';

  inputs = [
    {
      name: '@0',
    },
    {
      name: '@1',
    },
  ];

  outputs = [
    {
      name: 'Product',
    },
  ];

  connect(inputs: Observable<any>) {
    const obs = inputs.pipe(
      map(vals => vals.reduce((acc: number, num: number) => acc * num, 1)),
    );
    return [obs];
  }
}

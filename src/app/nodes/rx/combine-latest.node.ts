import { Observable, merge, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DesignerNode } from '../designer-node';

export class CombineLatestNode extends DesignerNode {
  static TITLE = 'Combine Latest';
  static LOCAL_ID = 'combineLatest';
  static GROUP_ID = 'rx';

  inputs = [
    {
      name: 'First',
      emit: true,
    },
    {
      name: 'Second',
      emit: true,
    },
  ];

  outputs = [
    {
      name: 'First',
    },
    {
      name: 'Second',
    },
  ];

  connect(inputs: Observable<any>) {
    const combined = inputs;
    return [
      combined.pipe(map(([first]) => first)),
      combined.pipe(map(([, second]) => second)),
    ];
  }
}

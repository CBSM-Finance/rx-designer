import { Observable, merge, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DesignerNode } from './designer-node';

export class MergeNode extends DesignerNode {
  static TITLE = 'Merge';
  static LOCAL_ID = 'merge';

  inputs = [
    {
      name: 'First',
    },
    {
      name: 'Second',
    },
    {
      name: 'Third',
    },
    {
      name: 'Fourth',
    },
  ];

  outputs = [
    {
      name: 'Merged',
    },
  ];

  connect(inputs: Observable<any>[]) {
    return [merge(...inputs)];
  }
}

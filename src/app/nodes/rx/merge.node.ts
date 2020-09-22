import { Observable, merge } from 'rxjs';
import { DesignerNode } from '../designer-node';

export class MergeNode extends DesignerNode {
  static TITLE = 'Merge';
  static LOCAL_ID = 'merge';
  static GROUP_ID = 'rx';

  inputs = [
    {
      name: 'First',
    },
    {
      name: 'Second',
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

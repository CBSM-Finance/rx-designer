import { Observable, of } from 'rxjs';
import { DesignerNode } from './designer-node';

export class NumberNode extends DesignerNode {
  static TITLE = 'Number';
  static LOCAL_ID = 'number';

  description = `Provide a static number.`;

  inputs = [
    {
      name: 'Number',
      type: 'Number',
      value: 4,
    },
  ];

  outputs = [
    {
      name: 'Number',
      type: 'Number',
    },
  ];

  connect(inputs: Observable<any>[]) {
    return [inputs[0]];
  }
}

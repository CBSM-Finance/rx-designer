import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DesignerNode } from './designer-node';

export class IsEvenNode extends DesignerNode {
  static TITLE = 'Is Even';
  static LOCAL_ID = 'isEven';

  inputs = [
    {
      name: 'Number',
    },
  ];

  outputs = [
    {
      name: 'Even',
      type: 'Number',
    },
    {
      name: 'Odd',
      type: 'Number',
    },
  ];

  connect(inputs: Observable<any>[]) {
    return [
      inputs[0].pipe(filter(num => num % 2 === 0)),
      inputs[0].pipe(filter(num => num % 2 !== 0)),
    ];
  }
}

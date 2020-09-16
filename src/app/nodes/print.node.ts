import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DesignerNode } from './designer-node';

export class PrintNode extends DesignerNode {
  static TITLE = 'Print';
  static LOCAL_ID = 'print';

  inputs = [
    {
      name: 'Text',
    },
  ];

  outputs = [
    {
      name: 'Connector',
    },
  ];

  connect(inputs: Observable<any>[]) {
    const print = inputs[0].pipe(tap(val => console.log(val)));
    return [print];
  }
}

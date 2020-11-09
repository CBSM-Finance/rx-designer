import { Observable, of } from 'rxjs';
import { DesignerNode } from './designer-node';

export class TextNode extends DesignerNode {
  static TITLE = 'Text';
  static LOCAL_ID = 'text';

  inputs = [
    {
      name: 'Text',
      value: 'Test',
      type: 'Text',
    },
  ];

  outputs = [
    {
      name: 'Text',
      type: 'Text',
    },
  ];

  connect(inputs: Observable<any>) {
    return [inputs];
  }
}

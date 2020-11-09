import { Observable } from 'rxjs';
import { DesignerNode } from './designer-node';

export class ConnectorNode extends DesignerNode {
  static TITLE = 'Connector';
  static LOCAL_ID = 'connector';

  inputs = [
    {
      name: 'First',
    },
  ];
  outputs = [
    {
      name: 'Connector',
    }
  ];

  description = 'Last node.';

  connect(inputs: Observable<any>): Observable<any>[] {
    return [inputs];
  }
}

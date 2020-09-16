import { Observable, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DesignerNode } from './designer-node';

export class ConnectorNode extends DesignerNode {
  static TITLE = 'Connector';
  static LOCAL_ID = 'connector';

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
      name: 'Connector',
    }
  ];

  description = 'Last node.';

  connect(inputs: Observable<any>[]): Observable<any>[] {
    return [merge(...inputs)];
  }
}

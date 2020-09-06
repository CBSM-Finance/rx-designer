import { of } from 'rxjs';
import { State } from '../state';
import { DesignerNode } from './designer-node';

export class EmptyNode implements DesignerNode {
  name = 'Empty';
  args = [];
  description = 'empty';

  operator() {
    return of({});
  }

  constructor() {}
  state: any;
  connect: (state: State) => any;
  disconnect: () => any;
}

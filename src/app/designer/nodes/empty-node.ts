import { BaseNode } from '@cbsm-finance/reactive-nodes';
import { of } from 'rxjs';

export class EmptyNode extends BaseNode {
  operator() {
    return of({});
  }

  constructor() {
    super('Empty');
  }
}

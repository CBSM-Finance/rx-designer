import { of } from 'rxjs';
import { BaseNode } from '@cbsm-finance/reactive-nodes';

export class JSONReaderNode extends BaseNode {
  operator() {
    return of({
      contracts: [{ symbol: 'UVXY' }, { symbol: 'DTO' }, { symbol: 'TVIX' }],
    });
  }

  constructor() {
    super('JSON Reader');
  }
}

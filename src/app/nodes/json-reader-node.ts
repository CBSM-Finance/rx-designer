import { of } from 'rxjs';
import { BaseNode } from '@cbsm-finance/reactive-nodes';
import {
  DesignerNode,
  DesignerNodeArgType,
  DesignerNodeArg,
} from './designer-node';
import { State } from '../state';

export class JSONReaderNode implements DesignerNode {
  name = 'JSON Reader';
  args: DesignerNodeArg[] = [
    {
      name: 'URL',
      type: DesignerNodeArgType.STRING,
      required: false,
      description: 'The JSON file path.',
    },
  ];

  description = `
    Read a JSON file relative to the application root folder.
  `;

  operator() {
    console.log('reading json file', this.args[0].value);
    return of({
      contracts: [{ symbol: 'UVXY' }, { symbol: 'DTO' }, { symbol: 'TVIX' }],
    });
  }

  constructor() {}
  state: any;
  connect: (state: State) => any;
  disconnect: () => any;
}

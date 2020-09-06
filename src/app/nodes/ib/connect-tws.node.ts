import { of } from 'rxjs';
import { State } from 'src/app/state';
import { DesignerNode, DesignerNodeArg, DesignerNodeArgType } from '../designer-node';
const electron = (window as any).require('electron');

export class ConnectTWSNode implements DesignerNode {
  state: any;
  name = 'Connect to TWS';
  args: DesignerNodeArg[] = [
    {
      name: 'URL',
      type: DesignerNodeArgType.STRING,
      required: false,
      description: 'The JSON file path.',
    }
  ];

  description = `
    Emits whenever TWS is connected.
  `;

  operator() {
    console.log('connect TWS', this.args[0].value);
    return of({
      contracts: [{ symbol: 'UVXY' }, { symbol: 'DTO' }, { symbol: 'TVIX' }],
    });
  }

  constructor() { }

  connect(state: State) {
    this.state = state;
    electron.ipcRenderer.sendSync('synchronous-message', 'ping');
  }

  disconnect() {

  }
}

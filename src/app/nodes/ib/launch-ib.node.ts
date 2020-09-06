import { DesignerNode, DesignerNodeArg, DesignerNodeArgType } from '../designer-node';
import { ElectronCommunicationService } from '../../electron-communication.service';
import { switchMapTo, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { State } from 'src/app/state';

export class LaunchIBNode implements DesignerNode {
  state: State;
  name = 'Launch IB';
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
    const electron = this.state.get('electron');
    return of(true).pipe(
      tap(() => electron.send('ib', 'launch')),
      switchMapTo(electron.on('ib', 'launched')),
      tap(() => {
        console.log('IB LAUNCHED!');
        electron.send('ib', 'observe messages');
      }),
      switchMapTo(electron.on('ib', 'message')),
      tap(msg => console.log('got ib message', msg)),
    );
  }

  constructor() { }

  connect(state: State) {
    this.state = state;
    console.log('connect ib');
  }

  disconnect() { }
}

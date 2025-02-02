import { Observable, of, combineLatest } from 'rxjs';
import { filter, finalize, mapTo, share, switchMapTo, tap } from 'rxjs/operators';
import { ElectronCommunicationService } from 'src/app/electron-communication.service';
import { DesignerNode } from '../designer-node';
import { LoggerService } from '../../logger.service';

export class ConnectTWSNode extends DesignerNode {
  static TITLE = 'Connect TWS';

  static GROUP_ID = 'ib';
  static LOCAL_ID = 'twsConnect';

  description = 'Connect to TWS.';

  inputs = [
    {
      name: 'Impulse',
    },
    {
      name: 'Port',
      value: 4001,
    },
    {
      name: 'Host',
      value: '127.0.0.1',
    },
    {
      name: 'Client Id',
      value: 1,
    },
  ];

  outputs = [
    {
      name: 'Connected',
    },
    {
      name: 'Disconnected',
    },
  ];

  connect(inputs: Observable<any>): Observable<any>[] {
    const electron = this.state.get('electron') as ElectronCommunicationService;
    const connect = inputs.pipe(
      tap(([, port, host, clientId]) =>
        electron.send('ib', 'connect', {
          port,
          host,
          clientId,
        })
      ),
      // finalize(() => {
      //   electron.send('ib', 'disconnect');
      //   console.log('connect done');
      // }),
      switchMapTo(electron.on('ib', 'message')),
      filter((msg) => msg.type === 'connection'),
      share()
    );

    const connected = connect.pipe(
      filter((msg) => msg.connected as boolean),
    );

    const disconnected = connect.pipe(
      filter((msg) => !(msg.connected as boolean))
    );
    return [connected, disconnected];
  }

  kill() {
    console.log('kill');
    const electron = this.state.get('electron') as ElectronCommunicationService;
    electron.send('ib', 'disconnect');
  }
}

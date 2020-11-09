import { DesignerNode, DesignerNodeArgType } from '../designer-node';
import { first, share, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ElectronCommunicationService } from 'src/app/electron-communication.service';
import { LoggerService } from 'src/app/logger.service';

export class LaunchIBNode extends DesignerNode {
  static TITLE = 'Launch IB';

  static GROUP_ID = 'ib';
  static LOCAL_ID = 'launch';

  description = 'Launch IB Connector.';

  inputs = [
    {
      name: 'Impulse',
      type: 'impulse',
      value: 1,
    }
  ];
  outputs = [
    {
      name: 'Launched',
    }
  ];

  connect(inputs: Observable<any>): Observable<any>[] {
    const electron = this.state.get('electron') as ElectronCommunicationService;
    const logger = this.state.get('logger') as LoggerService;
    const launched = inputs[0].pipe(
      switchMap(() => electron.send('ib', 'launch', {}, true)),
      first(),
      logger.log((msg) => ({
        level: 'info',
        node: this.title,
        msg,
      })),
      first(),
      share()
    );
    return [launched];
  }
}

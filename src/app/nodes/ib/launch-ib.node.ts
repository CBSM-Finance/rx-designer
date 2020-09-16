import { DesignerNode, DesignerNodeArgType } from '../designer-node';
import { share, switchMapTo, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ElectronCommunicationService } from 'src/app/electron-communication.service';
import { LoggerService } from 'src/app/logger.service';

export class LaunchIBNode extends DesignerNode {
  static TITLE = 'Launch IB';

  static GROUP_ID = 'ib';
  static LOCAL_ID = 'launch';

  description = 'Launch IB Connector.';

  inputs = [];
  outputs = [
    {
      name: 'Launched',
    }
  ];

  connect(): Observable<any>[] {
    const electron = this.state.get('electron') as ElectronCommunicationService;
    const logger = this.state.get('logger') as LoggerService;
    const launched = of(true).pipe(
      tap(() => electron.send('ib', 'launch')),
      switchMapTo(electron.on('ib', 'launched')),
      logger.log((msg) => ({
        level: 'info',
        node: this.title,
        msg,
      })),
      share()
    );
    return [launched];
  }
}

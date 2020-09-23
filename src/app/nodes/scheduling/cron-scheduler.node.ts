import { Observable } from 'rxjs';
import { withLatestFrom, switchMap, tap, mapTo, first, take, finalize } from 'rxjs/operators';
import { DesignerNode } from '../designer-node';
import { ElectronCommunicationService } from 'src/app/electron-communication.service';
import { Log, LoggerService } from 'src/app/logger.service';

export class CronSchedulerNode extends DesignerNode {
  static TITLE = 'Cron Scheduler';
  static LOCAL_ID = 'cronScheduler';
  static GROUP_ID = 'scheduling';

  inputs = [
    {
      name: 'Impulse',
    },
    {
      name: 'Cron',
      value: '*/1 * * * *', // run every minute
    },
  ];

  outputs = [
    {
      name: 'Invocation',
    },
  ];

  connect(inputs: Observable<any>[]) {
    const logger = this.state.get('logger') as LoggerService;
    const electron = this.state.get('electron') as ElectronCommunicationService;
    const obs = inputs[0].pipe(
      withLatestFrom(inputs[1]),
      switchMap(([, cron]) => electron.send('scheduling', 'cron', { cron }, true).pipe(mapTo(`Cron invocation: ${cron}`))),
      logger.log(msg => ({
        level: 'info',
        msg: typeof msg !== 'object' ? msg : void 0,
        obj: typeof msg === 'object' ? msg : void 0,
        node: 'Cron Scheduler',
      } as Log)),
    );
    return [obs];
  }
}

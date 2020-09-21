import { Observable } from 'rxjs';
import { withLatestFrom, switchMap, tap } from 'rxjs/operators';
import { DesignerNode } from '../designer-node';
import { ElectronCommunicationService } from 'src/app/electron-communication.service';

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
    const electron = this.state.get('electron') as ElectronCommunicationService;
    const obs = inputs[0].pipe(
      withLatestFrom(inputs[1]),
      switchMap(([, cron]) => electron.send('scheduling', 'cron', { cron }, true)),
      tap(data => console.log('cron', data)),
    );
    return [obs];
  }
}

import { Observable } from 'rxjs';
import { withLatestFrom, switchMap, tap, mapTo, first, take, finalize } from 'rxjs/operators';
import { DesignerNode } from '../designer-node';
import { ElectronCommunicationService } from 'src/app/electron-communication.service';
import { Log, LoggerService } from 'src/app/logger.service';

export class WaitSchedulerNode extends DesignerNode {
  static TITLE = 'Wait Scheduler';
  static LOCAL_ID = 'waitScheduler';
  static GROUP_ID = 'scheduling';

  inputs = [
    {
      name: 'Impulse',
    },
    {
      name: 'Seconds',
      value: 5, // run every minute
    },
  ];

  outputs = [
    {
      name: 'Invocation',
    },
  ];

  connect(inputs: Observable<any>) {
    const logger = this.state.get('logger') as LoggerService;
    const obs = inputs[0].pipe(
      withLatestFrom(inputs[1]),
      switchMap(([, seconds]) => new Observable(observer => {
        setTimeout(() => (observer.next(), observer.complete()), seconds * 1000);
      }).pipe(mapTo(`Wait scheduler invocation: ${seconds}`))),
      logger.log(msg => ({
        level: 'info',
        msg: typeof msg !== 'object' ? msg : void 0,
        obj: typeof msg === 'object' ? msg : void 0,
        node: 'Wait Scheduler',
      } as Log)),
    );
    return [obs];
  }
}

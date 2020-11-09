import { Observable, of, EMPTY } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Log, LoggerService } from '../logger.service';
import { DesignerNode } from './designer-node';

export class PrintNode extends DesignerNode {
  static TITLE = 'Print';
  static LOCAL_ID = 'print';

  description = 'Writes something to the console.';

  inputs = [
    {
      name: 'Text',
    },
    {
      name: 'Interpolation',
    },
  ];

  outputs = [
    {
      name: 'Connector',
    },
  ];

  connect(inputs: Observable<any>) {
    const logger = this.state.get('logger') as LoggerService;
    const print = inputs[0].pipe(
      withLatestFrom(inputs[1] === EMPTY ? of('') : inputs[1]),
      map(([text, interpolation]) => interpolation ? interpolation.replace('@0', text) : text),
      logger.log(msg => ({
        level: 'info',
        msg: typeof msg !== 'object' ? msg : void 0,
        obj: typeof msg === 'object' ? msg : void 0,
        node: 'Print',
      } as Log)),
    );
    return [print];
  }
}

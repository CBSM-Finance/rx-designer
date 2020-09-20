import { Observable, combineLatest, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
      name: 'String Interpolation',
      value: '@0',
    },
  ];

  outputs = [
    {
      name: 'Connector',
    },
  ];

  connect(inputs: Observable<any>[]) {
    const logger = this.state.get('logger') as LoggerService;

    // expected: A, B, C
    // actual: C
    // combineLatest([of('A', 'B', 'C'), of(1)]).pipe(
    //   tap(([letter]) => console.log(letter)),
    // ).subscribe();

    const print = combineLatest(inputs).pipe(
      // map(([text, inter]) => inter.replace('@0', text)),
      map(([text]) => text),
      tap(val => console.log('print', val)),
      logger.log(msg => ({
        level: 'info',
        msg,
        node: 'Print',
      } as Log)),
    );
    return [print];
  }
}

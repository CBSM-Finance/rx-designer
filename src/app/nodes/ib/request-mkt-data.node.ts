import { DesignerNode } from '../designer-node';
import { tap, switchMap, filter, map, scan } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { ElectronCommunicationService } from 'src/app/electron-communication.service';
import { Log, LoggerService } from 'src/app/logger.service';

export class RequestMktDataNode extends DesignerNode {
  static TITLE = 'Request Mkt Data';
  static LOCAL_ID = 'reqMktData';
  static GROUP_ID = 'ib';

  description = `Request market data for a given contract from Interactive Brokers.`;

  inputs = [
    {
      name: 'Contract',
      value: '{}',
      type: 'object',
    },
  ];

  outputs = [
    {
      name: 'Market Data',
    },
  ];

  private tickIds = {
    0: 'bidSize',
    1: 'bidPrice',
    2: 'askPrice',
    3: 'askSize',
    4: 'lastPrice',
    5: 'lastSize',
    6: 'high',
    7: 'low',
    8: 'volume',
    9: 'close',
    10: 'bidOptionComputation',
    11: 'askOptionComputation',
    // ...99
  };

  connect(inputs: Observable<any>): Observable<any>[] {
    const logger = this.state.get('logger') as LoggerService;
    const electron = this.state.get('electron') as ElectronCommunicationService;
    const mktData = inputs[0].pipe(
      switchMap(contract => electron.send('ib', 'reqmktdata', {
        contract,
      }, true)),
      tap(response => console.log('GOT RESPONSE!', response)),
      switchMap(({ tickerId }) => electron.on('ib', 'message').pipe(
        filter(msg => msg.tickerId === tickerId && this.tickIds[msg.field] !== void 0),
        map(msg => ({ [this.tickIds[msg.field]]: msg.price ?? msg.size })),
        scan((acc, val) => ({ ...acc, ...val }), { tickerId }),
        tap(msg => console.log(tickerId, msg)),
      )),
      logger.log(msg => ({
        level: 'info',
        msg: typeof msg !== 'object' ? msg : void 0,
        obj: typeof msg === 'object' ? msg : void 0,
        node: 'Market Data',
      } as Log)),
    );

    return [mktData];
  }
}

import { DesignerNode } from '../designer-node';
import { tap, switchMap, filter } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { ElectronCommunicationService } from 'src/app/electron-communication.service';
import { LoggerService } from 'src/app/logger.service';

export class RequestMktDataNode extends DesignerNode {
  static TITLE = 'Request Market Data';
  static LOCAL_ID = 'reqMktData';
  static GROUP_ID = 'ib';

  description = `Request market data for a given contract from Interactive Brokers.`;

  inputs = [
    {
      name: 'Impulse',
      type: 'impulse',
    },
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

  connect(inputs: Observable<any>[]): Observable<any>[] {
    const electron = this.state.get('electron') as ElectronCommunicationService;
    const mktData = inputs[0].pipe(
      switchMap(([, contract]) => electron.send('ib', 'reqmktdata', {
        contract,
      }, true)),
      tap(response => console.log('GOT RESPONSE!', response)),
      switchMap(({ tickerId }) => electron.on('ib', 'message').pipe(
        filter(msg => msg.tickerId === tickerId && msg.type === 'tickprice'),
        tap(msg => console.log(tickerId, msg)),
      )),
    );

    return [mktData];
  }
}

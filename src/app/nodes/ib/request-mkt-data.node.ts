// import { DesignerNode, DesignerNodeArg, DesignerNodeArgType } from '../designer-node';
// import { share, switchMapTo, tap } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { State } from 'src/app/state';
// import { ElectronCommunicationService } from 'src/app/electron-communication.service';
// import { LoggerService } from 'src/app/logger.service';

// export class RequestMktDataNode extends DesignerNode {
//   static TITLE = 'Request Mkt Data';
//   static LOCAL_ID = 'reqMktData';

//   state: State;
//   args: DesignerNodeArg[] = [
//     {
//       name: 'URL',
//       type: DesignerNodeArgType.STRING,
//       required: false,
//       description: 'The JSON file path.',
//     }
//   ];

//   description = `
//     Emits whenever TWS is connected.
//   `;

//   operator() {
//     const electron = this.state.get('electron') as ElectronCommunicationService;
//     const logger = this.state.get('logger') as LoggerService;

//     const contract = {
//       // multiplier;
//       // localSymbol;
//       exchange: 'ISLAND',
//       // primaryExch: '',
//       symbol: 'IBKR',
//       secType: 'STK',
//       currency: 'USD',
//     };

//     return of(true).pipe(
//       tap(() => electron.send('ib', 'launch')),
//       switchMapTo(electron.on('ib', 'launched')),
//       logger.log(msg => ({
//         level: 'info',
//         node: this.title,
//         msg,
//       })),
//       share(),
//     );
//   }

//   connect(state: State) {
//     this.state = state;
//   }

//   disconnect() { }
// }

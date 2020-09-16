// import { Observable, of } from 'rxjs';
// import { filter, mapTo, switchMapTo, tap } from 'rxjs/operators';
// import { ElectronCommunicationService } from 'src/app/electron-communication.service';
// import { DesignerNode, DesignerNodeArg, DesignerNodeArgType } from '../designer-node';
// import { LoggerService } from '../../logger.service';

// export class ConnectTWSNode2 extends DesignerNode {
//   static TITLE = 'Connect to TWS';
//   static LOCAL_ID = 'twsConnect';

//   args: DesignerNodeArg[] = [
//     {
//       name: 'URL',
//       type: DesignerNodeArgType.STRING,
//       required: false,
//       description: 'The JSON file path.',
//     }
//   ];

//   description = `
//     CONNECT
//   `;

//   operator(source: Observable<any>) {
//     const electron = this.state.get('electron') as ElectronCommunicationService;
//     const logger = this.state.get('logger') as LoggerService;
//     return source.pipe(
//       tap(() => electron.send('ib', 'connect', {
//         port: 4001,
//         host: '127.0.0.1',
//         clientId: 1,
//       })),
//       switchMapTo(electron.on('ib', 'message')),
//       filter(msg => msg.type === 'connection'),
//       filter(({ connected }) => connected as boolean),
//       mapTo('Connected to TWS'),
//       logger.log(msg => ({
//         level: 'info',
//         node: this.title,
//         msg,
//       })),
//     );
//   }
// }

// export class ConnectTWSNode {
//   static TITLE = 'Connect to TWS';
//   static LOCAL_ID = 'twsConnect';

//   inputs = [];

//   outputs = [
//     {
//       name: 'Connected',
//       type: 'BOOL',
//     },
//   ];

//   connect(inputs: Observable<any>) {
//     const traded = combineLatest(inputs).pipe(
//       tap(() => { }), // trade contracts
//     );
//     return [
//       traded.pipe(), // on transmit
//       traded.pipe(), // order status
//     ];
//   }
// }

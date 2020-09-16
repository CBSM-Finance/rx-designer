// import { DesignerNode, DesignerNodeArg, DesignerNodeArgType } from '../designer-node';
// import { share, switchMapTo, tap } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { State } from 'src/app/state';
// import { ElectronCommunicationService } from 'src/app/electron-communication.service';
// import { LoggerService } from 'src/app/logger.service';

// export class LaunchIBNode extends DesignerNode {
//   static TITLE = 'Launch IB';
//   static LOCAL_ID = 'launch';

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

// export class TransmitOrderNode {
//   static TITLE = 'Transmit Order';
//   static LOCAL_ID = 'transmitOrder';

//   inputs = [
//     {
//       name: 'Contract',
//       type: 'CONTRACT',
//     },
//     {
//       name: 'Quantity',
//       type: 'Number',
//     },
//   ];

//   outputs = [
//     {
//       name: 'Transmit',
//       type: 'CONTRACT',
//     },
//     {
//       name: 'Order Status',
//       type: 'ORDER_STATUS',
//     }
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

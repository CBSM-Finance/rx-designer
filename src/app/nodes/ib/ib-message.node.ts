// import { exception } from 'console';
// import { Observable, of } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { ElectronCommunicationService } from 'src/app/electron-communication.service';
// import { Log, LoggerService } from 'src/app/logger.service';
// import {
//   DesignerNode,
//   DesignerNodeArg,
//   DesignerNodeArgType,
// } from '../designer-node';

// export class IBMessageNode extends DesignerNode {
//   static TITLE = 'IB Message';
//   static LOCAL_ID = 'message';

//   args: DesignerNodeArg[] = [
//     {
//       name: 'URL',
//       type: DesignerNodeArgType.STRING,
//       required: false,
//       description: 'The JSON file path.',
//     },
//   ];

//   description = `
//     message
//   `;

//   operator(source: Observable<any>) {
//     const electron = this.state.get('electron') as ElectronCommunicationService;
//     const logger = this.state.get('logger') as LoggerService;
//     return source.pipe(
//       switchMap(() => electron.on('ib', 'message')),
//       logger.log(ibMessageToLog)
//     );
//   }
// }

// function ibMessageToLog(msg: any): Log {
//   const node = IBMessageNode.TITLE;

//   switch (msg.type) {
//     case 'iberror':
//       return {
//         level: 'error',
//         msg: {
//           code: msg.errorCode,
//           msg: msg.msg || (msg.e ? msg.e.Message : ''),
//         },
//         node,
//       };
//     case 'log':
//     case 'connection':
//       return {
//         level: 'info',
//         msg,
//         node,
//       };
//     default:
//       return {
//         level: 'error',
//         msg,
//         node,
//       };
//   }
// }

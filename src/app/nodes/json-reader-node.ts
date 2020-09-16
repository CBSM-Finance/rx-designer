// import { of } from 'rxjs';
// import {
//   DesignerNode,
//   DesignerNodeArgType,
// } from './designer-node';

// export class JSONReaderNode extends DesignerNode {
//   static TITLE = 'JSON Reader';
//   static LOCAL_ID = 'jsonReader';

//   args: DesignerNodeArg[] = [
//     {
//       name: 'URL',
//       type: DesignerNodeArgType.STRING,
//       required: false,
//       description: 'The JSON file path.',
//     },
//   ];

//   description = `
//     Read a JSON file relative to the application root folder.
//   `;

//   operator() {
//     console.log('reading json file', this.args[0].value);
//     return of({
//       contracts: [{ symbol: 'UVXY' }, { symbol: 'DTO' }, { symbol: 'TVIX' }],
//     });
//   }
// }

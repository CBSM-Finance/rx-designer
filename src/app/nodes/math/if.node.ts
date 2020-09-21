import { Observable, combineLatest } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import { DesignerNode } from '../designer-node';
import { evaluate } from 'mathjs';

export class IfNode extends DesignerNode {
  static TITLE = 'If';
  static LOCAL_ID = 'if';
  static GROUP_ID = 'math';

  inputs = [
    {
      name: 'Expression',
      value: 'a === b',
    },
    {
      name: '@0',
    },
    {
      name: '@1',
    },
  ];

  outputs = [
    {
      name: 'True',
    },
    {
      name: 'False',
    },
  ];

  connect(inputs: Observable<any>[]) {
    const obs = combineLatest(inputs).pipe(
      map(([expr, ...args]) => evaluate(expr
        .replace('@0', args[0])
        .replace('@1', args[1]))),
      share(),
    );
    return [
      obs.pipe(filter(Boolean)),
      obs.pipe(filter(res => !(Boolean(res)))),
    ];
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DesignerNode } from '../nodes/designer-node';
import { MarbleStateUpdate } from './marbles.service';

@Pipe({
  name: 'isTarget'
})
export class IsTargetPipe implements PipeTransform {

  transform(msu: MarbleStateUpdate, node: DesignerNode): boolean {
    return Boolean(msu.targets.find(target => target.node === node));
  }
}

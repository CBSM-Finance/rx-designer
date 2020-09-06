import { Component, OnInit, Input } from '@angular/core';
import { DesignerNodeArg } from 'src/app/nodes/designer-node';

@Component({
  selector: 'app-node-arg',
  templateUrl: './node-arg.component.html',
  styleUrls: ['./node-arg.component.scss']
})
export class NodeArgComponent {
  @Input() arg: DesignerNodeArg;

  constructor() { }

  updateValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.arg.value = value;
  }
}

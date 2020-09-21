import { Component, OnInit, Input } from '@angular/core';
import { Designer } from '../designer/designer';
import { DesignerNode, DesignerNodeInput } from '../nodes/designer-node';

@Component({
  selector: 'app-node-details',
  templateUrl: './node-details.component.html',
  styleUrls: ['./node-details.component.scss']
})
export class NodeDetailsComponent implements OnInit {
  @Input() node: DesignerNode;
  @Input() designer: Designer;

  constructor() { }

  ngOnInit(): void {
  }

  updateInput(input: DesignerNodeInput, evt: Event) {
    input.value = (evt.target as HTMLInputElement).value;
  }

  removeNode() {
    this.designer.removeNode(this.node);
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { DesignerNode } from '../nodes/designer-node';

@Component({
  selector: 'app-node-details',
  templateUrl: './node-details.component.html',
  styleUrls: ['./node-details.component.scss']
})
export class NodeDetailsComponent implements OnInit {
  @Input() node: DesignerNode;

  constructor() { }

  ngOnInit(): void {
  }
}

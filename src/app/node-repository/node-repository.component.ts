import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { nodeGroups } from '../nodes/node-groups';

@Component({
  selector: 'app-node-repository',
  templateUrl: './node-repository.component.html',
  styleUrls: ['./node-repository.component.scss']
})
export class NodeRepositoryComponent implements OnInit {
  @Output() instantiate = new EventEmitter<any>();

  nodeGroups = nodeGroups;

  constructor() { }

  ngOnInit(): void {
  }

  addNode(node: any) {
    this.instantiate.emit(new node());
  }
}

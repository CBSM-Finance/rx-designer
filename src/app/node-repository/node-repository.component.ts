import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { nodeGroups, NodeGroup } from '../nodes/node-groups';

@Component({
  selector: 'app-node-repository',
  templateUrl: './node-repository.component.html',
  styleUrls: ['./node-repository.component.scss']
})
export class NodeRepositoryComponent implements OnInit {
  @Output() instantiate = new EventEmitter<any>();

  nodeGroups = nodeGroups;
  private visibleGroups = [];

  constructor() { }

  ngOnInit(): void {
  }

  showGroup(group: NodeGroup): boolean {
    return this.visibleGroups.includes(group);
  }

  toggle(group: NodeGroup): void {
    if (this.visibleGroups.includes(group)) {
      this.visibleGroups = this.visibleGroups
        .filter(g => g !== group);
    } else {
      this.visibleGroups.push(group);
    }
  }

  addNode(node: any) {
    this.instantiate.emit(new node());
  }
}

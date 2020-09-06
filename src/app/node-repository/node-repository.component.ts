import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { JSONReaderNode } from '../nodes/json-reader-node';

@Component({
  selector: 'app-node-repository',
  templateUrl: './node-repository.component.html',
  styleUrls: ['./node-repository.component.scss']
})
export class NodeRepositoryComponent implements OnInit {
  @Output() instantiate = new EventEmitter<any>();

  nodes = [
    { name: 'JSON Reader', generate: () => new JSONReaderNode(), },
    { name: 'test', generate: () => new JSONReaderNode(), },
  ];

  constructor() { }

  ngOnInit(): void {
  }
}

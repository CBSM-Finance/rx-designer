import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-object-explorer',
  templateUrl: './object-explorer.component.html',
  styleUrls: ['./object-explorer.component.scss']
})
export class ObjectExplorerComponent implements OnInit {
  @Input() obj: any;

  sign: string;
  expanded = false;
  hasChildren = false;
  children: [string, any][];
  type: string;

  constructor() { }

  ngOnInit(): void {
    this.type = typeof this.obj;
    this.sign = this.getSign();
    this.getChildren();
  }

  private getSign(): string {
    if (typeof this.obj !== 'object' || Array.isArray(this.obj)) return JSON.stringify(this.obj);

    return '{' + Object.entries(this.obj)
      .map(([key, value]) => {
        switch (typeof value) {
          case 'string': return `${key}: "${value}"`;
          case 'number': return `${key}: ${value}`;
          case 'object':
            if (Array.isArray(value)) return `${key}: Array(${value.length})`;
            return `${key}: { ... }`;
        }
        return `${key}: ${value}`;
      }).join(', ') + '}';
  }

  private getChildren() {
    if (typeof this.obj !== 'object') return;
    this.hasChildren = true;
    this.children = Object.entries(this.obj);
  }
}

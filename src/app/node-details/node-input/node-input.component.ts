import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DesignerNode, DesignerNodeInput } from '../../nodes/designer-node';
import { Designer } from '../../designer/designer';
import { SubSink } from 'subsink';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-node-input',
  templateUrl: './node-input.component.html',
  styleUrls: ['./node-input.component.scss']
})
export class NodeInputComponent implements OnInit, OnDestroy {
  @Input() designer: Designer;
  @Input() node: DesignerNode;
  @Input() index: number;

  hasError: boolean;
  hasConn: boolean;
  control = new FormControl();
  input: DesignerNodeInput;

  private subs = new SubSink();

  constructor() { }

  ngOnInit(): void {
    this.input = this.node.inputs[this.index];
    this.setInitVal();
    this.setHasConn();

    this.subs.sink = this.control.valueChanges.pipe(
      tap((value) => {
        this.input.value = value;
        this.validate();
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private setInitVal() {
    const val = this.input.value;
    this.control.setValue(val);
  }

  private setHasConn(): void {
    const conn = this.designer.graph.incomingNode(this.node, this.index);
    this.hasConn = Boolean(conn);
    if (this.hasConn) {
      this.control.disable();
    }
  }

  private validate(): void {
    const value = this.input.value;
    this.hasError = (() => {
      switch (this.input.type) {
        case 'number': return false;
        case 'object':
          try {
            JSON.parse(value);
          } catch (e) {
            return true;
          }
          return false;
        case 'string':
        default:
          return false;
      }
    })();
  }

  disconnect() { }
}

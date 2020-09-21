import { Observable } from 'rxjs';
import { BaseNode } from '@cbsm-finance/reactive-nodes';
import { State } from '../state';

export abstract class DesignerNode implements BaseNode {

  /**
   * Large title for UI.
   */
  static TITLE = 'My Title';
  get title() {
    return (this.constructor as typeof DesignerNode).TITLE;
  }

  /**
   * Node id, unique to the node group.
   */
  static LOCAL_ID = 'myNode';
  get localId() {
    return (this.constructor as typeof DesignerNode).LOCAL_ID;
  }

  /**
   * Node group id.
   */
  static GROUP_ID = 'system';
  get groupId() {
    return (this.constructor as typeof DesignerNode).GROUP_ID;
  }

  state: any;
  inputs: DesignerNodeInput[];
  outputs: DesignerNodeOutput[];
  description: string;

  inputCount() {
    return this.inputs.length;
  }

  outputCount() {
    return this.outputs.length;
  }

  /**
   * Called when graph is executed.
   */
  initialize(state: State) {
    this.state = state;
  }

  /**
   * Called when graph execution is done.
   */
  kill() {}

  connect(inputs: Observable<any>[]): Observable<any>[] {
    return inputs;
  }
}

export class DesignerNodeInput {
  name: string;
  value?: any;
  type?: string;
  expose?: boolean;
}

export class DesignerNodeOutput {
  name: string;
  type?: string;
}

export enum DesignerNodeArgType {
  STRING,
  NUMBER,
  ARRAY,
  OBJECT,
}

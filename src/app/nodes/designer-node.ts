import { Observable } from 'rxjs';
import { BaseNode } from '@cbsm-finance/reactive-nodes';
import { State } from '../state';

export interface DesignerNode extends BaseNode {
  state: any;
  name: string;
  args: DesignerNodeArg[];
  description: string;

  /**
   * Called when graph is executed.
   */
  connect: (state: State) => any;

  /**
   * Called when graph execution is done.
   */
  disconnect: () => any;
}

export interface DesignerNodeArg {
  name: string;
  type: DesignerNodeArgType;
  description?: string;
  lastValue?: any;
  required?: boolean;
  value?: any;
}

export enum DesignerNodeArgType {
  STRING,
  NUMBER,
  ARRAY,
  OBJECT,
}
